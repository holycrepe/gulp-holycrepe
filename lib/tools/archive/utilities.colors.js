'use strict'

(function () {
    //const config1   = require('./config');
    const $        = require('jquery');
    $.extend       = require('jquery-extend');
    const chalk    = require("chalk");

    module.exports = (function () {

        /**
         *
         * @type {ChalkStyleMapping}
         */
        const extendedColors = {
            brightRed: colors.bold.red
        };

        /**
         * @type {ChalkExtendedStyles}
         */
        let colors = chalk;

        /**
         *
         * @param extendedColors {ChalkStyleMapping}
         * @return {ChalkExtendedStyles}
         */
        const addStyles = function(extendedColors) {
            $.extend(colors, extendedColors);
            return oolors;
        }


        addStyles(extendedColors);

        colors.addStyles = addStyles;

        return colors;

    })();

}

}).call(this);
