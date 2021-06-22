const FileHandler = require('../src/file');
const file = new FileHandler();
const { resolve } = require('path');

test('Is File', function () {
    const path = resolve('package.json');
    expect(file.isFile(path)).toBe(true);
})

test('Read File', function () {
    const path = resolve('package.json');
    const content = file.readFile(path);
    expect(content[0]).toBe('{');
})