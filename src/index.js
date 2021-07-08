(function (root, factory) {
    'use strict';
    if (typeof define == 'function' && define.amd) {
        define('what', factory);
    } else if (typeof exports == 'object') {
        exports = module.exports = factory();
    } else {
        root.what = factory();
    }
})(this, function () {
    var what = {
        version: '1.0.1',
        isDeno: typeof Deno != 'undefined',
        isNode:
            typeof process != 'undefined' &&
            typeof Deno == 'undefined' &&
            process.versions != null &&
            process.versions.node != null,
        isBrowser:
            typeof window != 'undefined' &&
            typeof window.document != 'undefined',
        isCommandLine: false,
        noThrow: function (fn, df) {
            try {
                return fn();
            } catch (err) {
                return df;
            }
        },
        flat: function (arr) {
            return [].concat.apply([], arr);
        },
        first: function (text) {
            if (Array.isArray(text)) {
                return text[0].toString();
            } else {
                return text.toString();
            }
        },
        defaultOptions: {},
    };

    // define if run from command line
    (function (what) {
        if (what.isNode == true && module.parent != null) {
            var id = module.parent.id;
            var isNotCommandLine =
                id.indexOf('jswhat/src/cli/index.js') == -1 &&
                id.indexOf('jswhat\\src\\cli\\index.js') == -1;
            what.isCommandLine = isNotCommandLine == false;
        }
    })(what);

    // require the package.json file and define the default options
    (function (what) {
        if (what.isNode == true && module.filename != null) {
            var path = what.noThrow(function () {
                return require('path');
            });
            var projectRoot = path.resolve(module.filename, '../../');
            var hasNodeModules = module.filename.indexOf('node_modules') != -1;
            if (hasNodeModules) {
                projectRoot = path.resolve(
                    module.filename.split('node_modules')[0]
                );
            }

            var packagePath = path.resolve(projectRoot, 'package.json');
            var packageJson = what.noThrow(function () {
                return require(packagePath);
            });
            if (packageJson.jswhat != null) {
                what.defaultOptions = packageJson.jswhat;
            }
        }
    })(what);

    require('./fetch.js')(what);

    require('./read.js')(what);

    require('./check.js')(what);

    require('./json.js')(what);

    /**
     * Identify anything.
     * @param {string|string[]} text Text to be identified.
     * @param {boolean} search Search the text globally.
     * @param {object} options Extra options.
     * @param {boolean} [options.nonText] Text should be treated as a file path or URL.
     * @param {string|string[]} [options.filter] Names or tags to filter results by.
     * @param {string|string[]} [options.exclude] Names or tags to exclude from the results.
     * @param {boolean} [options.promise] Return a promise in all cases.
     * @param {boolean} [options.throwError] In case of an error, throw it instead of saving it to the 'error' property.
     * @returns {object[]|promise<object[]>} If successful, an array containing objects with what was identified,
     * if it is unsuccessfully, the result will have an error property.
     */
    what.is = function (text, search, options) {
        if (search == null) {
            search = false;
        }
        if (options == null) {
            options = {};
        }

        var defaultOptions = what.defaultOptions;
        if (defaultOptions != {}) {
            var defaultKeys = Object.getOwnPropertyNames(defaultOptions);
            for (var i = 0; i < defaultKeys.length; i++) {
                var key = defaultKeys[i];
                options[key] = options[key] || defaultOptions[i];
            }
        }

        var original = text;
        if (text == null) {
            text = new Error("[jswhat] Missing or invalid argument 'text'");
        } else if (Array.isArray(text) == false && typeof text != 'string') {
            text = new Error(
                "[jswhat] Parameter 'text' must be an array or string"
            );
        } else {
            if (options.nontext == null && options.nonText == null) {
                text = what.flat([text]);
                original = what.flat([text]);
            } else {
                text = what.first(text);
                if (what.isURL(text)) {
                    if (what.fetch == null) {
                        text = new Error(
                            '[jswhat] Fetch is not supported in this environment'
                        );
                    } else {
                        // this returns a promsie which gets handled later
                        text = what.fetch(text);
                    }
                } else if (what.isFile != null && what.isFile(text) == true) {
                    if (what.read == null) {
                        text = new Error(
                            '[jswhat] Read file is not supported in this environment'
                        );
                    } else {
                        text = what.read(text);
                    }
                } else {
                    text = new Error(
                        '[jswhat] Invalid file path or URL: ' + text
                    );
                }
            }
        }

        function check(strings) {
            if (strings instanceof Error) {
                if (options.throwError == true) {
                    throw strings;
                }
                return what.matches([], original, strings);
            } else {
                if (options.search == null) {
                    options.search = search;
                }
                return what.check(strings, options);
            }
        }

        // in the case fetch returns a promise, this will resolve
        // it before running the 'what.check' check method
        if (text instanceof Promise) {
            return text.then(function (d) {
                return check(d);
            });
        } else if (options.promise == true) {
            return new Promise(function (resolve) {
                return resolve(check(text));
            });
        }
        return check(text);
    };

    return what;
});
