(function () {
    const verbose        = 2;
    const config         = {
        switches: {
            buildTests:       false,
            autoReloadTarget: true
        },
        order:    {
            masks:     {
                definitions: [
                    ['proto', "prototype"],
                    ['core', "Core"],
                    ['core (class)', "apEMP/Core"],
                    ['utils', "Utils"],
                    ['utils (class)', "apEMP/Core/Utils"],
                    ['objects.search', "Objects/Search"],
                    ['objects', "Objects"],
                    ['cats (apEMP)', "apEMP/**/Categories"],
                    ['Constants', "emp/**/Constants"],
                    ['cats (emp)', "emp/Categories"],
                    ['Classes', "Classes"],
                    ['All', "**"]
                ],
                formatSpecs: [
                    ["{{name}} (Base Dir)", "**/{{mask}}/**/Base/*.[jt]s"],
                    ["{{name}} (Base)", "**/{{mask}}/**/*Base.[jt]s"],
                    ["{{name}}", "**/{{mask}}/**/*.[jt]s"]
                ],
                final:       []
            },
            verbosity: {
                matchAny: verbose > 0,
                patterns: verbose > 5,
                onSort:   verbose > 1 //["Utils"]
            },
        },
        verbose:  {
            default: verbose > 0,
            order:   {
                before:  verbose > 2,
                without: verbose > 1,
                after:   verbose > 0
            }
        },
        logging: {
            logger: "grunt"
        }
    };
    const configurations = {
        babel:      {
            es6:    {
                presets: [
                    ['es2015']
                ]
            },
            latest: {
                presets: [
                    ['env', {
                        targets: {
                            chrome: 52
                        }
                    }]
                ]
            }
        },
        typescript: {
            old:    {
                sortOutput:         true,
                preserveConstEnums: true,
                pretty:             true,
                module:             'es2016',
                target:             'es6'
            },
            latest: {
                //sortOutput:         true,
                preserveConstEnums: true,
                pretty:             true,
                module:             'amd',
                target:             'es6'
            }
        },
    };

    config.typescript = configurations.typescript.latest;
    config.babel      = configurations.babel.latest;

    module.exports = (() => {
        "use strict";
        return config
    })();

}).call(this);
