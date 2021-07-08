module.exports = exports = /***(***/ function (what) {
    if (what.isNode == true) {
        what.fetch = (function () {
            var http = what.noThrow(function () {
                return require('http');
            });
            var https = what.noThrow(function () {
                return require('https');
            });

            if (http != null && https != null) {
                return function (link) {
                    return new Promise(function (resolve) {
                        var url = {
                            protocol: link.split('/')[0],
                            href: link,
                        };

                        var hyper = null;
                        if (url.protocol == 'https:') {
                            hyper = https;
                        } else {
                            hyper = http;
                        }

                        return hyper.get(url.href, function (res) {
                            var data = '';
                            res.on('data', function (c) {
                                data = data + c.toString();
                            });
                            res.on('error', function (err) {
                                return resolve(err);
                            });
                            res.on('end', function () {
                                return resolve(data);
                            });
                            return res;
                        });
                    });
                };
            }
            return null;
        })();
    } else if (what.isDeno == true) {
        what.fetch = function (link) {
            return fetch(link).then(function (res) {
                return res.text();
            });
        };
    } else if (what.isBrowser && window.fetch != 'undefined') {
        what.fetch = function (link) {
            return window.fetch(link).then(function (res) {
                return res.text();
            });
        };
    } else {
        what.fetch = null;
    }

    // https://stackoverflow.com/q/5717093
    what.isURL = function (string) {
        var data = string.match(
            /(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
        );
        return data != null;
    };
} /***)(what)***/;
