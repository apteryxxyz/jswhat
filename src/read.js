module.exports = exports = /***(***/ function (what) {
    if (what.isNode == true) {
        var fs = what.noThrow(function () {
            return require('fs');
        });
        var path = what.noThrow(function () {
            return require('path');
        });

        if (fs != null && path != null) {
            what.read = function (file) {
                if (what.isFile(file) == false) {
                    return new Error(
                        '[jswhat] File at ' + file + ' does not exist'
                    );
                }
                var content = fs.readFileSync(file).toString();
                return content;
            };

            what.isFile = function (file) {
                return fs.existsSync(file) && fs.lstatSync(file).isFile();
            };
        }
    } else if (what.isDeno == true) {
        what.read = function (file) {
            if (what.isFile(file) == false) {
                return new Error(
                    '[jswhat] File at ' + file + ' does not exist'
                );
            }
            var content = Deno.readTextFileSync(file); // eslint-disable-line no-undef
            return content;
        };

        what.isFile = function (file) {
            try {
                var stat = Deno.statSync(file); // eslint-disable-line no-undef
                return stat.isFile;
            } catch (error) {
                return false;
            }
        };
    } else {
        what.read = null;
        what.isFile = null;
    }
} /***)(what)***/;
