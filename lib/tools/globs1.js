(function() {
    var Minimatch, path, through;

    const globs     = {
        All:            makeGlobs(),
        NoAutoComplete: makeGlobs("", ".Autocomplete-Only.d"),
        Proto:          makeGlobs('prototype'),
        URL:            makeGlobs('classes/apEMP/Core/URL'),
        apEMP:          {
            All:    makeGlobs('classes/apEMP'),
            Core:   makeGlobs('classes/apEMP/Core'),
            Shared: makeGlobs('classes/apEMP/Shared'),
        },
        Emp:            {
            All:  makeGlobs('classes/emp'),
            Core: makeGlobs('classes/emp/Core')
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
        .concat(invertGlobs(globs.Core.Base));


    through = require("through");

    gutil = require("gulp-util");

    Minimatch = require("minimatch").Minimatch;

    path = require("path");

    module.exports = function(namedPatterns, options) {
        var files, matchers, onEnd, onFile, rank, relative;
        if (namedPatterns == null) {
            namedPatterns = [];
        }
        if (options == null) {
            options = {};
        }

        var verbosity = options.verbosity || {};
        verbosity.onSort = verbosity.onSort || options.verbose;

        files = [];
        var patterns = [];
        var patternMapper = function(pattern) {
            if (pattern.indexOf("./") === 0) {
                throw new Error("Don't start patterns with `./` - they will never match. Just leave out `./`");
            }
            return Minimatch(pattern);
        };
        var createPatternName = function(pattern) {
            return pattern.split("/").join("\\").split("\\").map(function(patternItem) {
                var period = patternItem.lastIndexOf(".");
                if (period > -1)
                    patternItem = patternItem.substring(0, period);
                patternItem = patternItem.split("*").join("");
                return patternItem;
            }).filter(function(item) {
                item.length > 0
            }).join("\\");
        };
        if (verbosity.patterns)
            gutil.log(gutil.colors.blue("Gulp.Order Patterns: "));
        patterns = namedPatterns.map(function(pattern) {
            if (typeof pattern === "string")
                pattern = [pattern];
            if (Array.isArray(pattern)) {
                if (pattern.length === 1)
                    pattern = {mask: pattern[0]};
                else
                    pattern = {
                        name: pattern[0],
                        mask: pattern[1]
                    };
            }
            if (!pattern.name)
                pattern.name = pattern.mask.split("/").join("\\").split("\\").map(function(patternItem) {
                    var period = patternItem.lastIndexOf(".");
                    if (period > -1)
                        patternItem = patternItem.substring(0, period);
                    patternItem = patternItem.split("*").join("");
                    return patternItem;
                }).filter(function(item) {
                    item.length > 0
                }).join("\\");
            pattern.matcher = patternMapper(pattern.mask);
            if (verbosity.patterns)
                gutil.log(gutil.colors.green(pattern.name + ": ").padRight(40) + pattern.mask);
            return pattern;
        });
        var names = patterns.map(p => p.name);
        matchers = patterns.map(p => p.matcher);
        //matchers = patterns.map(patternMapper);
        onFile = function(file) {
            return files.push(file);
        };
        relative = function(file) {
            if (options.base != null) {
                return path.relative(options.base, file.path);
            } else {
                return file.relative;
            }
        };
        rank = function(s) {
            var index, matcher, _i, _len;
            for (index = _i = 0, _len = matchers.length; _i < _len; index = ++_i) {
                matcher = matchers[index];
                var matcherName = names[index];
                if (matcher.match(s)) {
                    return index;
                }
            }
            return matchers.length;
        };
        var getMatcherName = function(index) {
            if (index < names.length)
                return names[index];
            return "No Match";
        };
        var getMatcherInfo = function(index) {
            if (index < names.length)
                return gutil.colors.yellow(index.toString().padLeft(3) + ": "
                    + names[index].padLeft(25) + ": " );
            return "".padLeft(15);
        };
        var getDoVerbose = function(aRelative, bRelative) {
            var verbose = verbosity.onSort;
            if (typeof verbose === "boolean")
                return verbose;
            if (Array.isArray(verbose)) {
                var aMatches = false,
                    bMatches = false;
                for (var i=0,j=verbose.length;i<j;i++) {
                    var item = verbose[i];
                    aMatches |= aRelative.indexOf(item) > -1;
                    bMatches |= bRelative.indexOf(item) > -1;
                    if (verbosity.matchAny === true && (aMatches || bMatches))
                        return true;
                }
                return aMatches && bMatches;
            }
            if (typeof verbose === "function")
                return verbose(aRelative, bRelative);
            return verbose;
        }
        onEnd = function() {
            files.sort(function(a, b) {
                var aIndex, bIndex;
                var aRelative, bRelative, result, compType;
                aRelative = relative(a);
                bRelative = relative(b);
                aIndex = rank(relative(a));
                bIndex = rank(relative(b));
                if (aIndex === bIndex) {
                    result = String(aRelative).localeCompare(bRelative);
                    compType = " Direct";
                } else {
                    result = aIndex - bIndex;
                    compType = "Pattern";
                }
                if (!getDoVerbose(aRelative, bRelative))
                    return result;
                var fileAInfo = gutil.colors.green(" File A: ") + getMatcherInfo(aIndex) + aRelative;
                var fileBInfo = gutil.colors.green(" File B: ") + getMatcherInfo(bIndex) + bRelative;
                var fileInfo;
                if (result < 0)
                    fileInfo = fileAInfo + "\n" + fileBInfo;
                else
                    fileInfo = fileBInfo + "\n" + fileAInfo;
                gutil.log(gutil.colors.white(
                        "Compare: ") //+ compType + ": " + result
                    + "\n" + fileInfo
                );
                return result;
            });
            files.forEach((function(_this) {
                return function(file) {
                    return _this.emit("data", file);
                };
            })(this));
            return this.emit("end");
        };
        return through(onFile, onEnd);
    };

}).call(this);
