module.exports = function (what, input, timer) {
    var output = {
        handleError: function (error) {
            var message = error;
            if (typeof error != 'string') {
                message = error.message;
            }
            message = message.replace(/\[jswhat\] ?/, '');

            return console.error(
                '\x1b[31m%s\x1b[0m',
                '\n' + message + '\nTook: ' + (Date.now() - timer) + 'ms'
            );
        },

        handleTable: function (matched, total, table) {
            var header = '\nPossible Identification\n';
            if (total > 50) {
                header =
                    header + 'Showing ' + matched.length + '/' + total + '\n';
            }
            header = header + 'Took: ' + (Date.now() - timer) + 'ms';

            console.log('\x1b[36m%s\x1b[0m', header);
            if (table.options != null) {
                console.log(table.toString());
            } else {
                console.table(table);
            }
            if (total > 25) {
                return console.log('\x1b[36m%s\x1b[0m', header);
            }
        },

        handleTags: function () {
            return console.log(
                '\n',
                what.flat(
                    what.json.regexes.map(function (r) {
                        return r.tags;
                    })
                )
            );
        },

        generateOptions: function () {
            function repeat(string, count) {
                var output = '';
                while (count) {
                    output = output + string;
                    count--;
                }
                return output;
            }

            var options = input.options;
            return (
                options
                    .map(function (o) {
                        var string = ' ';
                        if (o.name[1] != null) {
                            string = string + '-' + o.name[1] + ', ';
                        }
                        var count = 20 - o.name[0].length;
                        string =
                            string +
                            '--' +
                            o.name[0] +
                            repeat(' ', count) +
                            o.description;
                        return string;
                    })
                    .join('\n') + '\n'
            );
        },

        generateExamples: function () {
            return (
                [
                    '192.168.0.2',
                    'e@mail.com --search',
                    'dQw4w9WgXcQ --filter=media',
                    'path/to/file --nontext --search',
                    'https://raw.github.com/apteryxxyz/jswhat/main/README.md -n -s',
                    '--tags',
                    'e@mail.com g@mail.com fakemail.com -s -f="Email Address"',
                    'e@mail.com g@mail.com hot@mail.com mail.google.com -s -e="Email Address"',
                ]
                    .map(function (e) {
                        return ' * what ' + e;
                    })
                    .join('\n') + '\n'
            );
        },

        handleHelp: function () {
            return console.log(
                '\n' +
                    'jsWhat - Identify what something is.\n' +
                    'Made by Apteryx (https://github.com/apteryxxyz)\n' +
                    'Based on pyWhat (https://github.com/bee-san/pyWhat)\n' +
                    '\n' +
                    'Usage: what <text> [options]\n',
                '\n' +
                    'Options:\n' +
                    output.generateOptions() +
                    '\n' +
                    'Examples:\n' +
                    output.generateExamples()
            );
        },
    };
    return output;
};
