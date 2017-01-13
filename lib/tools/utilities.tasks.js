'use strict';
const gutil = require("gulp-util");
gutil.log("Global Scope: ", this);

(function () {

    const $       = require('jquery');
    $.extend = require('jquery-extend');
    //const config1   = require('./config');
    const gulp       = require("gulp");
    const exec  = require('child_process').exec;
    const gutil = require("gulp-util");
    const util  = require("gulp-util");
    const watch = require('gulp-watch');
    const batch = require('gulp-batch');
    const sourcemaps = require('gulp-sourcemaps');
    const ts         = require("gulp-typescript");
    const babel      = require("gulp-babel");

    let colors = util.colors;
    const logData = (heading, data) => {
        //gutil.log(colors.bold(colors.red((heading + ": "))));
        //gutil.log(JSON.stringify(data, null, 4));
    }

    const logScope = (scopeName, scope, self, direct) => {
        const header = `${scopeName} Scope`;
        logData(header, scope);
        logData(`${header}: Self`, scope);
        logData(`${header}: Direct`, direct);
    }
    logData("Colors", Object.keys(colors.styles));
    logData("Outer Scope", this);

    module.exports =  (config, tasks) => {
        "use strict";

        const utils = this.utils = (require('./utilities.base'))(config);
        const logging = utils.logging;
        const logData = logging.logData;
        const logScope = logging.logScope;
        logData("Inner Scope", this);


        logging.logData = logData;
        logging.logScope = logScope;
        utils.tasks = {};
        let main,build,reload,watch;
        (function (self) {
            const logScope = (scopeName, scope) =>
                logging.logScope(scopeName, self, utils.tasks.main);

            logScope("Main", this);

            const main = self;
            const createTask = (taskName, taskFunc, dependsOn, options) => {
                const taskWrappers = {
                    default: () => taskFunc().pipe(utils.logging.printer),
                    verbose: () => {
                        gutil.log("Starting " + taskName);
                        const p = taskFunc();
                        debugger;
                        const r = p.pipe(utils.logging.printer);
                        ///gutil.log("Printed " + taskName);
                        return r;
                    }
                };
                if (typeof options === "undefined") {
                    options = {};
                }
                if (typeof options !== "object") {
                    options = {
                        wrapper: options
                    };
                }
                let wrapper = options.wrapper;
                if (wrapper === true || options.verbose)
                    wrapper = "verbose";
                if (!wrapper || !taskWrappers.hasOwnProperty('default')) {
                    wrapper = "default";
                }
                if (dependsOn && !Array.isArray(dependsOn))
                    dependsOn = [dependsOn];

                gulp.task(taskName, dependsOn, taskWrappers[wrapper]);
            }
            const create = (taskName, taskFunc) => {
                logScope("Function main.create()", this);

                const taskLists    = {
                    all: []
                };
                const forEachInner = (mainTask, type, subKey) => {
                    const taskNameMain    = mainTask[0];
                    const taskNameCurrent = taskName + '-' + taskNameMain;
                    //gutil.log(`Creating ${type.capitalizeFirstLetter()} Task '${taskNameCurrent}'`);
                    if (!taskLists.hasOwnProperty(type)) {
                        taskLists[type] = [];
                    }
                    taskLists[type].push(taskNameCurrent);
                    taskLists.all.push(taskNameCurrent);
                    createTask(taskNameCurrent, taskFunc(mainTask[1], taskNameMain, false));
                };

                const forEachNested = function (obj, depth, cb, sortKeys, sortDescending) {
                    if (typeof depth === "function") {
                        sortDescending = sortKeys;
                        sortKeys       = cb;
                        cb             = depth;
                        depth          = 2;
                    }
                    const keyHistory            = [];
                    const nestedForEachCaller   = function (obj, keyHistory) {
                        if (!keyHistory)
                            keyHistory = [];
                        const currentDepth          = keyHistory.length,
                              sortKeysCurrent       =
                                  (Array.isArray(sortKeys))
                                      ? sortKeys[currentDepth]
                                      : sortKeys,
                              sortDescendingCurrent =
                                  (Array.isArray(sortDescending))
                                      ? sortDescending[currentDepth]
                                      : sortDescending;
                        return $.forEach(obj,
                            nestedForEachCallback(keyHistory.slice()),
                            sortKeysCurrent,
                            sortDescendingCurrent);
                    };
                    const nestedForEachCallback = function (oldKeyHistory) {
                        return function (subValue, subKey) {
                            const keyHistory = oldKeyHistory.slice();
                            keyHistory.push(subKey);
                            if (keyHistory.length >= depth) {
                                const args = [subValue].concat(keyHistory);
                                return cb.apply(null, args);
                            }
                            return nestedForEachCaller(subValue, keyHistory);
                        }
                    };
                    return nestedForEachCaller(obj);
                };

                forEachNested(tasks.masks, forEachInner);

                $.forEach(taskLists, (taskList, type) => {
                    let combinedTask = taskName.suffix(type, "all");
                    gulp.task(combinedTask, taskList, function () {
                        gutil.log(`Completed ${type.capitalizeFirstLetter()} Task: ${combinedTask}`);
                    });
                });
            }

            return $.extend(main, $.extend(main, {
                createTask: createTask,
                create: create
            }));
        })(main = utils.tasks.main || (utils.tasks.main = {}));
        $.extend(utils.tasks, (function () {
            return {
                main1: main,
                build:  {
                    create: () => {
                        utils.tasks.main.create('build', (srcGlobs, output, orderOutput) => () => {
                            let outputFile = output + '.js';

                            const tsResult = gulp.src(srcGlobs)
                                .pipe(sourcemaps.init()) // This means sourcemaps will be generated
                                .pipe(ts($.extend({}, config.typescript, {
                                    outFile: outputFile
                                })));

                            let result =
                                    tsResult.js
                                        .pipe(babel(
                                            config.babel
                                        ));
                            //.pipe(gulp.src("**/*.js"))

                            if (orderOutput === false) {
                                //debugger;
                                if (config.verbose.order.without)
                                    result = result.pipe(utils.logging.printer(`Source for ${output}`));
                            } else {
                                if (config.verbose.order.before)
                                    result = result.pipe(printer("Before Ordering"));
                                result = result.pipe(doOrder);
                                if (config.verbose.order.after)
                                    result = result.pipe(printer("After Ordering"));
                            }

                            return result
                            //.pipe(concat(outputFile)) // You can use other plugins that also support gulp-sourcemaps
                                .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
                                .pipe(gulp.dest(outDir + "/.."));
                        });
                    }
                },
                reload: {
                    isEnabled: (taskName) =>
                                   (config.switches.autoReloadTarget
                                   && (typeof taskName === "undefined" || tasks.reload.indexOf(taskName) > -1)),

                    execute: (taskName) => {
                        if (this.isEnabled(taskName)) {
                            gutil.log(colors.magenta(`Reloading Extensions for ${taskName}...`));

                            exec("C:\\Users\\Avi\\AppData\\Local\\PortableApps\\GoogleChromePortableDev\\GoogleChromePortable.exe --allow-file-access-from-files  --remote-debugging-port=9222 http://reload.extensions")
                        }
                        else {
                            gutil.log(colors.magenta(`NOT Reloading Extensions for ${taskName}...`));
                        }
                    },

                    createTask: (taskName) => () => this.execute(taskName),
                    create:     () => {
                        for (let i = 0, j = tasks.reload.length; i < j; i++) {
                            const taskName = tasks.reload[i];
                            logData("Function Scope: reload.create()", this);
                            gulp.task(taskName + "-reload", [taskName], this.createTask(taskName));
                        }
                    }
                },
                watch:  {
                    createTask: (taskName, excludeTaskSuffix, manualReload) => {
                        const taskNameBase    = taskName;
                        const isReloadEnabled = config.switches.autoReloadTarget
                            && tasks.reload.includes(taskName);
                        if (isReloadEnabled || manualReload)
                            taskName += "-reload";
                        gulp.task('watch' + (excludeTaskSuffix ? "" : "_" + taskNameBase), [taskNameBase], function () {
                            const logWatchTaskEvent = (eventType, suffix) => {
                                gutil.log(
                                    gutil.colors.magenta(eventType + " ")
                                    + (config.switches.autoReloadTarget ? gutil.colors.green("Extension Reloading ") : "")
                                    + gutil.colors.magenta("Watcher for ")
                                    + gutil.colors.red(`Task "${taskNameBase}"`)
                                    + (suffix || "")
                                );
                            };
                            logWatchTaskEvent("Starting",
                                gutil.colors.magenta(" ERROR - LOGGING NOT WORKING: ")
                                // gutil.colors.magenta(" with scopes: ")
                                // + globs.Full.joinNumbered(
                                //     gutil.colors.yellow("{num}")
                                //     + gutil.colors.gray(". ")
                                //     + gutil.colors.blue("{value}"),
                                //     {
                                //         sep:    gutil.colors.white(", "),
                                //         indent: 12
                                //     }
                                // )
                            );

                            return watch(tasks.masks.All, batch(function (events, done) {
                                logWatchTaskEvent("Executing");
                                gulp.start(taskName, done);
                            }));
                            //return gulp.watch(globs.TypeScript, [taskName], function);
                        });
                    },

                    create: () => {
                        for (let i = 0, j = tasks.watch.length; i < j; i++) {
                            const task          = tasks.watch[i],
                                  excludeSuffix = (i == 0);
                            this.createTask(task, excludeSuffix);
                            // if (reloadExtensionsTasks.indexOf(task) > -1)
                            //     createWatch(task, excludeSuffix, true);
                        }
                    }
                }
            };
        }).call(utils));

        //return utils;
        return utils.tasks;
    };

}).call(this);
