#!/usr/bin/env node
(function () {
    return;

    /**
     * const writeFileSync = require('fs').writeFileSync;
    const resolve = require('path').resolve;
    const fetch = require('node-fetch');

    const identifiers = require('../src/data/regex/identifiers.json');
    const urlRegex = identifiers.find(function (i) { return i.name == 'Uniform Resource Locator (URL)'; });

    return fetch('https://data.iana.org/TLD/tlds-alpha-by-domain.txt')
        .then(function (res) { return res.text(); })
        .then(function (txt) { return txt.split(/\s/g).slice(10).sort(function (a, b) { return b.length - a.length; }).filter(function (d) { return d && d.length < 7; }).join('|'); })
        .then(function (topLevelDomains) {
            const newIdentifers = identifiers.filter(function (i) { return i != urlRegex; });

            urlRegex.regex =
                '(((https?|ftp)://((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}' +
                '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]{1,5})?)([a-z0-9-_/]?\\.?)*|' +
                '((https?|ftp)://)?(\\S+:\\S+@)?([a-z0-9-_]?\\.?)+?([a-z0-9-_][a-z0-9-_]{0,62})' +
                `\\.(${topLevelDomains})(:\\d{2,5})?([/?#]\\S*)?)`;
            newIdentifers.push(urlRegex);

            return writeFileSync(
                resolve('src/data/regex/identifiers.json'),
                JSON.stringify(newIdentifers)
            );
        });
     */
})();
