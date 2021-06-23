const what = require('../');
const regex = what.regex;

for (const r of regex.regexes) {
    if (!r.test) continue;
    test(r.name, function () {
        const match = regex.check(r.test);
        expect(match.names).toContain(r.name);
    })
}