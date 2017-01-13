(function () {
    "use strict";
    
    module.exports = function (config) {
        const utils = require('./utilities.base')(config);
        utils.logging.logData("utils.globs", utils.globs, true);
        const globs     = {
            All:            utils.globs.create(),
            NoAutoComplete: utils.globs.create("", ".Autocomplete-Only.d"),
            Proto:          utils.globs.create('prototype'),
            URL:            utils.globs.create('classes/apEMP/Core/URL'),
            apEMP:          {
                All:    utils.globs.create('classes/apEMP'),
                Core:   utils.globs.create('classes/apEMP/Core'),
                Shared: utils.globs.create('classes/apEMP/Shared'),
            },
            Emp:            {
                All:  utils.globs.create('classes/emp'),
                Core: utils.globs.create('classes/emp/Core')
            },

        };
        globs.Shared    = globs.apEMP.Shared.concat();
        globs.Core      = {
            Base: globs.apEMP.Core
                      .concat(globs.Emp.Core)
        };
        globs.Core.Full = globs
            .NoAutoComplete
            .concat(globs.Proto, globs.Core.Base);
        globs.Full      = globs
            .NoAutoComplete
            .concat(globs.All)
            .concat(utils.globs.invert(globs.Core.Base));

        const tasks = {
            masks: globs,
            reload: [],
            watch: ['build'],
            builds: {
                main:  [
                    ['core', globs.Core],
                    ['full', globs.Full],
                ],
                extra: [
                    ['URL', globs.URL]
                ]
            }
        };

        tasks.reload = tasks.watch.slice();
        
        return tasks;
    };

}).call(this);
