var output = require('./output');
module.exports = function (what) {
    what.isNode;

    var input = {
        options: [
            {
                name: ['help', 'h'],
                value: ['boolean', true],
                description: 'Show help message.',
            },
            {
                name: ['version', 'v'],
                value: ['boolean', true],
                description: 'Show the installed version of jsWhat.',
            },
            {
                name: ['search', 's'],
                value: ['boolean', true],
                description: 'Search globally within a string.',
            },
            {
                name: ['non-text', 'n'],
                value: ['boolean', true],
                description: 'The text input is a file path or URL.',
            },
            {
                name: ['tags', 't'],
                value: ['boolean', true],
                description: 'Show all the available tags.',
            },
            {
                name: ['filter', 'f'],
                value: ['string', null],
                description:
                    'Filter the results by names or tags, separate by commons.',
            },
            {
                name: ['exclude', 'e'],
                value: ['string', null],
                description:
                    'Exclude results based on names and tags, separate by commons.',
            },
        ],

        handleOptions: function (argv) {
            var options = {};
            var flags = argv.filter(function (a) {
                return a[0] == '-';
            });
            for (var i = 0; i < flags.length; i++) {
                var flag = flags[i].replace(/-/g, '').split('=');
                var option = input.options.filter(function (o) {
                    return o.name.indexOf(flag[0]) != -1;
                });
                if (option != null && option[0] != null) {
                    option = option[0];
                }
                if (option == null) {
                    return input.invalidFlag(flag[0]);
                } else if (option.value[0] == 'boolean') {
                    options[option.name[0]] = true;
                } else if (option.value[0] == 'string') {
                    options[option.name[0]] = flag[1];
                }
            }
            return options;
        },

        handleText: function (argv) {
            return argv.filter(function (a) {
                return a[0] != '-';
            });
        },

        invalidFlag: function (flag) {
            return output.handleError("Invalid option '" + flag + "'");
        },

        checkVersion: function (wanted) {
            var version = process.version
                .slice(1)
                .split('.')
                .map(function (n) {
                    return Number(n);
                });
            wanted = wanted.split('.').map(function (n) {
                return Number(n);
            });

            if (version[0] < wanted[0]) {
                return false;
            } else if (version[1] < wanted[1]) {
                return false;
            } else if (version[2] < wanted[2]) {
                return false;
            }
            return true;
        },
    };
    return input;
};
