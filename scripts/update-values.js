#!/usr/bin/env node
(function () {
    const readFileSync = require('fs').readFileSync;
    const writeFileSync = require('fs').writeFileSync;
    const resolve = require('path').resolve;
    const packageJson = require('../package.json');

    const readMeContent = readFileSync(
        resolve(__dirname, '../README.md')
    ).toString();
    let newReadMeContent = readMeContent
        .replace(
            /(version-(\d{1,3}\.\d{1,3}\.\d{1,3})-red)/g,
            'version-' + packageJson.version + '-red'
        )
        .replace(
            /jswhat@\d{1,3}\.\d{1,3}\.\d{1,3}/g,
            'jswhat@' + packageJson.version
        );
    writeFileSync(resolve(__dirname, '../README.md'), newReadMeContent);

    const indexContent = readFileSync(
        resolve(__dirname, '../src/index.js')
    ).toString();
    let newIndexContent = indexContent.replace(
        /\d{1,3}\.\d{1,3}\.\d{1,3}/,
        packageJson.version
    );
    writeFileSync(resolve(__dirname, '../src/index.js'), newIndexContent);
})();
