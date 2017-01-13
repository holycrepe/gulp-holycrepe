'use strict'
;
(function() {

    'use strict'

    console.log("Test");
    let jQuery       = require('jquery');
    const gutil      = require("gulp-util");
    const verbose    = 2;
    const config    = require('./build/config');
    const tasks    = (require('./build/tasks'))(config);
    console.log("Test");
  //

    const gulp_order = require("gulp-order-ext");
    const orderMasks = config.order.masks.final;
    delete config.order.masks;
    const doOrder = gulp_order(orderMasks, config.order);
    console.log("Test");


    gutil.log(gutil.colors.blue("Creating gulp tasks"));
// gutil.log(gutil.colors.yellow("Build Config: "));
// gutil.log(config);
    gutil.log(gutil.colors.green("Task Data: "));
    gutil.log(tasks);
    gutil.log(gutil.colors.green("utils.tasks: "));
    gutil.log(utils);

    utils.tasks.build.create();
    utils.tasks.reload.create();
    utils.tasks.watch.create();

  //   console.log("Test");
  //
  // module.exports = function(namedPatterns, options) {
  //
  //     const verbose    = 2;
  //     const config    = require('./build/config');
  //     const tasks    = (require('./build/tasks'))(config);
  //     return;
  // };

}).call(this);
