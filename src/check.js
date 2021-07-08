module.exports = exports = /***(***/ function (what) {
    what.check = function (strings, options) {
        var timer = Date.now();
        strings = what.flat([strings]);
        if (options == null) {
            options = {};
        }

        var error;
        if (
            options.exclude &&
            Array.isArray(options.exclude) == false &&
            typeof options.exclude != 'string'
        ) {
            matched.error = new Error(
                "[jswhat] Option 'exclude' must be an array or string"
            );
        }
        if (
            options.include &&
            Array.isArray(options.include) == false &&
            typeof options.include != 'string'
        ) {
            error = new Error(
                "[jswhat] Option 'include' must be an array or string"
            );
        }
        if (options.search && typeof options.search != 'boolean') {
            error = new Error("[jswhat] Option 'search' must be a boolean");
        }
        if (Array.isArray(strings) == false && typeof strings != 'string') {
            error = new Error(
                "[jswhat] Parameter 'text' must be an array or string"
            );
        }
        if (error != null) {
            return what.matches([], strings, error);
        }

        var regexes = what.json.regexes.map(function (r) {
            var c = JSON.parse(JSON.stringify(r)),
                newFlags = r.flags;
            c.boundary = '^' + r.regex + '$';
            if (options.search != true) {
                c.regex = c.boundary;
            }
            if (options.search == true) {
                newFlags = newFlags + 'g';
            }
            c.expression = new RegExp(c.regex, newFlags);
            return c;
        });

        if (options.filter != null) {
            var filter = what.flat([options.filter]).map(function (t) {
                return t.toLowerCase();
            });
            regexes = regexes.filter(function (r) {
                var keep = false;
                for (var i = 0; i < filter.length && keep != true; i++) {
                    keep =
                        what
                            .flat([r.name, r.short, r.category, r.tags])
                            .map(function (t) {
                                return t.toLowerCase();
                            })
                            .indexOf(filter[i]) != -1;
                }
                return keep;
            });
        }

        if (options.exclude != null) {
            var exclude = what.flat([options.exclude]).map(function (t) {
                return t.toLowerCase();
            });
            regexes = regexes.filter(function (r) {
                var keep = true;
                for (var i = 0; i < exclude.length && keep != false; i++) {
                    keep =
                        what
                            .flat([r.name, r.short, r.category, r.tags])
                            .map(function (t) {
                                return t.toLowerCase();
                            })
                            .indexOf(exclude[i]) == -1;
                }
                return keep;
            });
        }

        var matches = [];
        for (var i = 0; i < strings.length; i++) {
            var string = strings[i];
            for (var j = 0; j < regexes.length; j++) {
                var regex = regexes[j];
                var matched = string.match(regex.expression);
                if (matched == null) {
                    continue;
                } else if (matched.input == null) {
                    matched = matched.map(function (m) {
                        return m.match(new RegExp(regex.regex, regex.flags));
                    });
                } else {
                    matched = [matched];
                }

                for (var k = 0; k < matched.length; k++) {
                    var match = matched[k];
                    match.url = regex.url;
                    match.description = regex.description;

                    if (regex.name == 'Phone Number') {
                        var locations = [];
                        for (var l = 0; l < what.json.phoneCodes.length; l++) {
                            var phone = what.json.phoneCodes[l];
                            if (match[0].trim().includes(phone.code)) {
                                locations.push(phone.country);
                            }
                        }
                        if (locations.length >= 1) {
                            match.description =
                                'Location(s): ' + locations.join(', ');
                        }
                    }

                    if (regex.url && regex.url.split('').indexOf('{') != -1) {
                        for (var m = 0; m < 10; m++) {
                            if (match[0] == null) {
                                continue;
                            } else {
                                match.url = match.url.replace(
                                    new RegExp('\\{' + m + '\\}', 'g'),
                                    match[m]
                                );
                            }
                        }
                    }

                    matches.push({
                        matched: match[0],
                        name: regex.name,
                        short: regex.short,
                        category: regex.category,
                        description: match.description,
                        url: match.url,
                        regex: new RegExp(regex.boundary, regex.flags),
                        tags: regex.tags,
                    });
                }
            }
        }

        matches = what.matches(matches, strings, null);
        matches.time = Date.now() - timer;
        return matches;
    };

    what.matches = function (results, text, error) {
        var matches = results || [];
        matches.text = text;
        matches.error = error;

        matches.matched = results.map(function (m) {
            return m.matched;
        });
        matches.names = results.map(function (m) {
            return m.name;
        });
        matches.shortNames = results.map(function (m) {
            return m.short;
        });
        matches.tags = what.flat(
            results
                .map(function (m) {
                    return m.tags;
                })
                .filter(function (t, i, s) {
                    return s.indexOf(t) == i;
                })
        );

        return matches;
    };
} /***)(what)***/;
