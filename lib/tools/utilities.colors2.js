/**

 * Module for generating colored strings
 * @module utils/colors2
 * @exports {ChalkStylesExtended}
 */

    //const config1   = require('./config');
const $        = require('jquery');
$.extend       = require('jquery-extend');

//noinspection JSValidateTypes
/**
 * @type {ChalkStylesExtended}
 */
let colors = require("chalk");


/**
 *
 * @param extendedColors
 * @return {ChalkStylesExtended}
 */
function addColors(extendedColors) {
    $.extend(colors, extendedColors);
    return colors;
}

colors.add = addColors;



colors
//.add(extendedColors)
    .add({
        brightRed: colors.bold.red,
        aaaaaaaaa: colors.bold.red
    })
    .add({
        banner: colors.brightRed
    });

// return colors;
// (function () {
//
//
//
// })();

/**
 * @type {ChalkStylesExtended}
 */
module.exports = colors;

