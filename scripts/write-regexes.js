#!/usr/bin/env node
(function () {
    const readFileSync = require('fs').readFileSync;
    const writeFileSync = require('fs').writeFileSync;
    const resolve = require('path').resolve;

    const regexes = require('../src/data/regexes.json').map(function (r) {
        delete r.test;
        return r;
    });

    const phoneCodes = require('../src/data/phone_codes.json');
    const whatContent = readFileSync(
        resolve(__dirname, '../src/json.js')
    ).toString();

    const newContent = whatContent.replace(
        /(what\.json = {.+};?)/gm,
        'what.json = ' + JSON.stringify({ regexes, phoneCodes }) + '}'
    );

    return writeFileSync(resolve(__dirname, '../src/json.js'), newContent);
})();
