'use strict';

(function () {
    //const config1   = require('./config');
    const logging = require("./logging");

    let colors = logging.colors;


    module.exports = function (config) {

        //let utils;
        let myGlob = {
            create: function (subDir, fileName, invert) {
                const globs = [];
                subDir      = typeof subDir === "undefined" ? "" : "/" + subDir;
                const base  = `scripts${subDir}/**/`;
                globs.push(`${invert ? "!" : ""}${base}*${fileName || ""}.ts`);
                if (!invert && !config.switches.buildTests)
                    globs.push(`!${base}*.Tests.ts`);
                return globs;
            },
            invert: 1,
            process: 1
        }
        let utilGlobs = {
            create:  (subDir, fileName, invert) => {
                const globs = [];
                subDir      = typeof subDir === "undefined" ? "" : "/" + subDir;
                const base  = `scripts${subDir}/**/`;
                globs.push(`${invert ? "!" : ""}${base}*${fileName || ""}.ts`);
                if (!invert && !config.switches.buildTests)
                    globs.push(`!${base}*.Tests.ts`);
                return globs;
            },
            invert:  (globs) =>
                         globs
                             .filter(x => !x.startsWith("!"))
                             .map(x => "!" + x)
                             .concat(globs.map(x => x.replace(/(.+\*)\.ts$/i, "$1.d.ts"))),
            process: (masks) => {
                const formats      = masks.formatSpecs.map(x => x.map(y => hb.compile(y)));
                //var formats = masks.formatSpecs;
                const totalFormats = formats.length;
                let i              = 0;
                const j            = masks.definitions.length;
                for (; i < j; i++) {
                    const o = array.zipObject(['name', 'mask'], masks.definitions[i]);
                    for (let k = 0; k < totalFormats; k++) {
                        const final = formats[k].map(x => x(o));
                        masks.final.push(final);
                    }
                }
            }
        };
        // let utils;
        // (function (utils) {
        //     utils.masks = utilGlobs;
        // })(utils || (utils = {}));
        //return utils;
        //return utils.globs;
        //logging.logData("utils.masks!", utilGlobs.create("a"), true);
        return utilGlobs;
    };

}).call(this);
