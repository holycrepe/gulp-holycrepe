'use strict';
(function () {
    const $       = require('jquery');
    $.extend = require('jquery-extend');
    const gutil      = require("gulp-util");

    const colors = require("./utilities.colors");

    const colors2 = require("./utilities.colors2");


    module.exports = function (config) {

        //let utils;

        //(function (utils) {
        // let logging;
        // (function (logging) {
        //
        // })(logging = utils.logging || (utils.logging = {}))


        const log = (() => {
            if (config.logging.logger === "grunt")
                return gutil.log;
            return console.log;
        })();

        const logData = (heading, data, extended) => {

            heading += ": ";
            if (extended) {
                //gutil.log(`<${heading}>`);

                log(colors.brightRed.bgYellow(heading));
                log(JSON.stringify(data, null, 4));
                return;
            }
            //return;
            log(chalk.brightRed(heading));
            log(JSON.stringify(data, null, 4));
        };
        const logDataExtended = (heading, data) => logData(heading, data, true);

        const logScope = (scopeName, scope, self, direct) => {
            const header = `${scopeName} Scope`;
            logData(header, scope);
            logData(`${header}: Self`, scope);
            logData(`${header}: Direct`, direct);
        };

        const logging = {
            printerFactory: (prefix) => print((filepath) => ((prefix || "built") + ": " + filepath)),
            logData:        logData,
            logScope:       logScope
        };

        logging.printer = logging.printerFactory();
        logging.colors = colors;

        logDataExtended("Log Colors", Object.keys(chalk.styles));
        throw new Error();
        debugger;
    };

}).call(this);
