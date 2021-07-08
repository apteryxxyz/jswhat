const what = require('../');

test('Is URL', function () {
    const path = 'https://data.iana.org/TLD/tlds-alpha-by-domain.txt';
    expect(what.isURL(path)).toBe(true);
});

test('Fetch URL', function () {
    const path = 'https://data.iana.org/TLD/tlds-alpha-by-domain.txt';
    if (what.fetch == null) throw new Error('[jswhat] Fetch is not supported');
    return what.fetch(path).then(function (content) {
        expect(content[0]).toBe('#');
    });
});
