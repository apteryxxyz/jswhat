'use strict';

const what = require('../dist/what.js');
const regexes = require('../data/regexes.json');
const tests = regexes.reduce((a, b) => a + b.tests.length, 0);
const assert = require('assert');

(function $() {
    let f = 0;

    for (let i = 0; i < regexes.length; i++) {
        const regex = regexes[i];

        if (regex.tests.length === 0) {
            console.warn(`${regex.short} does not have any tests`);
            continue;
        } else {
            for (let j = 0; j < regex.tests.length; j++) {
                const test = regex.tests[j];
                const result = what.is(test, { search: true, filter: [regex.name] });

                try {
                    assert.equal(result.names.includes(regex.name), true);
                    // console.log('\x1b[32m%s\x1b[0m', `${regex.short} passed on test ${j}`);
                } catch (err) {
                    console.error('\x1b[31m%s\x1b[0m', `${regex.short} failed on test ${j}`);
                    f++;
                }
            }

        }
    }

    if (f === 0) console.log('\x1b[32m%s\x1b[0m', `\nAll ${tests} identify tests have passed!`);
    else {
        console.error('\x1b[31m%s\x1b[0m', `\n${f} out of the ${tests} identify tests have failed!`);
        process.exit(1);
    }
}());
