#!/usr/bin/env node
(function () {
    const { writeFileSync, readdirSync } = require('fs');
    const { resolve } = require('path');

    const data = (function () {
        const directoryContent = readdirSync('src/data/regex');
        const regexes = [];
        for (const fileName of directoryContent) {
            const regexPath = resolve('src/data/regex', fileName);
            regexes.push(require(regexPath));
        }
        return [].concat.apply([], regexes);
    })();

    const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
    const string = JSON.stringify(sorted).replace(
        /("tags": ?null|"tags": ?"")/g,
        '"tags": []'
    );

    return writeFileSync(
        resolve(__dirname, '../src/data/regexes.json'),
        string
    );
})();
