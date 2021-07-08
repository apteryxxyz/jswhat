const what = require('../src');
const regexes = require('../src/data/regexes.json');

for (var i = 0; i < regexes.length; i++) {
    var r = regexes[i];
    if (r.test == null) continue;
    test(r.name, function () {
        const match = what.is(r.test);
        expect(match.names).toContain(r.name);
    });
}
