const what = require('../src');
const assert = require('assert');

(async function $() {
    const [urls, paths] = [
        ['https://data.iana.org/TLD/tlds-alpha-by-domain.txt', 'https://apteryx.xyz/', 'https://example.com'],
        ['test/identify.test.js', 'package.json', './bin/what']
    ];
    let tests = 0, f = 0;

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];

        try {
            tests++;
            assert.equal(typeof what.url(url)?.fetch, 'function');
        } catch (_) {
            f++;
            console.error('\x1b[31m%s\x1b[0m', `URL failed test on ${url}`);
            break;
        }

        try {
            tests++;
            const data = await what.url(url).fetch();
            assert.equal(typeof data === 'string' && data.length > 0, true);
        } catch (_) {
            f++;
            console.error('\x1b[31m%s\x1b[0m', `URL failed fetch test on ${url}`);
            break;
        }
    }

    for (let j = 0; j < paths.length; j++) {
        const path = paths[j];

        try {
            tests++;
            assert.equal(typeof what.path(path)?.read, 'function');
        } catch (_) {
            f++;
            console.error('\x1b[31m%s\x1b[0m', `Path failed test on ${path}`);
            break;
        }

        try {
            tests++;
            const data = await what.path(path).read();
            assert.equal(typeof data === 'string' && data.length > 0, true);
        } catch (_) {
            f++;
            console.error('\x1b[31m%s\x1b[0m', `Path failed read test on ${path}`);
            break;
        }
    }

    if (f === 0) console.log('\x1b[32m%s\x1b[0m', `\nAll ${tests} nontext tests have passed!`);
    else {
        console.error('\x1b[31m%s\x1b[0m', `\n${f} out of the ${tests} nontext tests have failed!`);
        process.exit(1);
    }
}());
