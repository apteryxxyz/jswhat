'use strict';

const { is, Regexes } = require('../');
const assert = require('node:assert');
const testCount = Regexes.reduce((a, b) => a + b.tests.length, 0);

(function _() {
    let failCount = 0;

    for (const regex of Regexes) {
        if (regex.tests.length === 0) {
            console.warn(`${regex.short} does not have any tests`);
            continue;
        }

        for (const test of regex.tests) {
            const index = regex.tests.indexOf(test);
            const result = is(test, { search: true, filter: [regex.name] });

            try {
                const names = result.map((r) => r.name);
                assert.equal(names.includes(regex.name), true);
            } catch (err) {
                console.error('\x1b[31m%s\x1b[0m', `${regex.short} failed on test ${index}`);
                failCount++;
            }
        }
    }

    if (failCount === 0) {
        console.log('\x1b[32m%s\x1b[0m', `\nAll ${testCount} identify tests have passed!`);
    } else {
        console.error('\x1b[31m%s\x1b[0m', `\n${failCount} out of the ${testCount} identify tests have failed!`);
        process.exit(1);
    }
})();
