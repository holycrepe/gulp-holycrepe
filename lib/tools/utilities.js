'use strict';

(function () {
    module.exports = function (config, tasks) {
        let utils = (require("./utilities.base"))(config);
        (function (utils) {
            utils.tasks = (require("./utilities.tasks"))(config, tasks);
        })(utils || (utils = {}));
        return utils;
    };
}).call(this);
