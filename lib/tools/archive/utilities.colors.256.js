'use strict';

(function () {
    //const config1   = require('./config');
    const $       = require('jquery');
    $.extend = require('jquery-extend');
    const gutil      = require("gulp-util");
    const chalk = require("chalk");

    let colors = require('ansi-256-colors');

    console.log(colors.fg.getRgb(2,3,4) + colors.bg.getRgb(4,4,4) + 'Hello world!' + colors.reset);

    function printAllColors() {
        console.log('\x1b[38;5;255m\x1b[4;37mDefault palette:\x1b[0m');
        colors.bg.standard.forEach(function (c, i) { process.stdout.write(c + 'defaults ' + i + '  '); });
        console.log(colors.reset + '\n');

        console.log('\x1b[38;5;255m\x1b[4;37mBright palette:\x1b[0m');
        colors.bg.bright.forEach(function (c, i) { process.stdout.write(c + 'bright ' + i + '    '); });
        console.log(colors.reset + '\n');

        console.log('\x1b[38;5;255m\x1b[4;37mRGB ranges 0 to 6:\x1b[0m');
        for (var r = 0; r < 6; r++) {
            for (var g = 0; g < 6; g++) {
                for (var b = 0; b < 6; b++) {
                    process.stdout.write(colors.bg.getRgb(r, g, b) + 'r:' + r + ' g:' + g + ' b:' + b + ' ');
                }
                process.stdout.write('\n');
            }
            if (r !== 5) process.stdout.write('\n');
        }
        console.log(colors.reset);

        console.log('\x1b[38;5;255m\x1b[4;37mGrayscales:\x1b[0m');
        colors.bg.grayscale.forEach(function (c, i) {
            process.stdout.write(c + 'gray ' + (i < 10 ? '0' : '') + i + '     ' + ((i+1) % 6 ? '' : '\n'));
        });
        console.log(colors.reset);
    }



}).call(this);
