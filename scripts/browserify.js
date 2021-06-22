const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const package = require('../package.json');

(function () {
    const regexes = require('../src/data/regexes.json').map(r => {
        delete r.test;
        return r;
    })
    const phoneCodes = require('../src/data/phone_codes.json');
    const whatLines = readFileSync(resolve('dist/what.js')).toString().split('\n');
    const jsonLine = whatLines.find(l => l.match(/.+(this\.regex\.json = {).+/));
    const index = whatLines.indexOf(jsonLine);

    if (jsonLine) {
        const newLine = `what.regex.json = ${JSON.stringify({ regexes, phoneCodes })};`;
        whatLines[index] = newLine;
    }

    const newCopyrightLine = `/* jswhat v${package.version} | (c) 2021 Apteryx */`;
    whatLines[0] = newCopyrightLine;
    return writeFileSync(resolve('dist/what.js'), whatLines.join('\n'));
})();