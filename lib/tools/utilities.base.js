'use strict';

(function () {
    module.exports = function (config) {
        let utils;
        const globsf = (require("./utilities.masks"));
        const globs = (require("./utilities.masks"))(config);
        (function (utils) {
            utils.logging = require("./logging");
            utils.globs = (require("./utilities.masks"))(config);
        })(utils || (utils = {}));

        utils.logging.logData("utils.base.globs", globs, true);

        return utils;
    };

}).call(this);
