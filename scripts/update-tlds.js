const { writeFileSync } = require('fs');
const { resolve } = require('path');
const url = new (require('../src/url'));

async function getTlds() {
    const tlds = await url.fetchURL('https://data.iana.org/TLD/tlds-alpha-by-domain.txt');
    return tlds.slice(10).sort((a, b) => b.length - a.length).filter(d => d.length < 7).join('|');
}

(async function () {
    const identifiers = require('../src/data/regex/identifiers.json');
    const urlRegex = identifiers.find(i => i.name === 'Uniform Resource Locator (URL)');
    const topLevelDomains = await getTlds();
    const newIdentifers = identifiers.filter(i => i !== urlRegex);

    urlRegex.regex = "(((https?|ftp):\/\/((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}" +
        "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]{1,5})?)([a-z0-9-_\/]?\\.?)*|" +
        "((https?|ftp):\/\/)?(\\S+:\\S+@)?([a-z0-9-_]?\\.?)+?([a-z0-9-_][a-z0-9-_]{0,62})" +
        `\\.(${topLevelDomains})(:\\d{2,5})?([\/?#]\\S*)?)`;
    newIdentifers.push(urlRegex);

    writeFileSync(resolve('src/data/regex/identifiers.json'), JSON.stringify(newIdentifers));
})();