var what = require('../index.js');
var package = require('../../package.json');
var timer = Date.now();

var input = require('./input.js')(what);
var output = require('./output.js')(what, input, timer);

module.exports = function (argv) {
    argv = argv.slice(2);
    var options = input.handleOptions(argv);
    var text = input.handleText(argv);

    // if (!options && !text) return output.handleHelp();
    if (options.help) return output.handleHelp();
    if (options.tags) return output.handleTags();
    if (options.version) return console.log(package.version);

    if (input.checkVersion('10.0.0') == false) {
        return output.handleError(
            "'What' in the command line requires Node version 10.0.0 and above\n" +
                "You can still use 'what' programmaticly."
        );
    }

    options.promise = true;
    return what.is(text, options.search, options).then(function (data) {
        if (data.error != null) {
            return output.handleError(data.error + '.');
        }
        if (data.length < 1) {
            return output.handleError('Zero matches found.');
        }
        var totalMatched = data.length;
        if (totalMatched > 50) data = data.slice(0, 50);

        var table = data.map(function (x) {
            return {
                'Matched at': x.matched,
                'Identified as': x.name,
                Description: x.description || 'None',
                URL: x.url || 'None',
            };
        });

        return output.handleTable(data, totalMatched, table);
    });
};
