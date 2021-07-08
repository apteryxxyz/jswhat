const what = require('../');
const resolve = require('path').resolve;

test('Is File', function () {
    const path = resolve('package.json');
    expect(what.isFile(path)).toBe(true);
});

test('Read File', function () {
    const path = resolve('package.json');
    const content = what.read(path);
    expect(content[0]).toBe('{');
});
