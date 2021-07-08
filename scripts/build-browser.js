#!/usr/bin/env node

(function () {
    const readFileSync = require('fs').readFileSync;
    const writeFileSync = require('fs').writeFileSync;
    const resolve = require('path').resolve;

    const indexContent = readFileSync(
        resolve(__dirname, '../src/index.js')
    ).toString();
    let newIndexContent = indexContent;
    const requires = indexContent.match(
        /require\('([a-zA-Z/.-]+)'\)\(what\);/g
    );

    for (var i = 0; i < requires.length; i++) {
        var statement = requires[i];
        var filename = statement.match(/require\('([a-zA-Z/.-]+)'\)/)[1];
        var fileContents = readFileSync(
            resolve(__dirname, '../src', filename)
        ).toString();

        var browserified = fileContents
            .replace(/module.exports = exports = /, '')
            .replace(/(\/\*\*\*)|(\*\*\*\/)/g, '');
        newIndexContent = newIndexContent.replace(statement, function () {
            return browserified;
        });

        writeFileSync(resolve(__dirname, '../dist/what.js'), newIndexContent);
    }
})();
