const { writeFileSync, readdirSync } = require('fs');
const { resolve } = require('path');

function getRegexes() {
    const directoryContent = readdirSync('src/data/regex');
    const regexes = [];
    for (const fileName of directoryContent) {
        const regexPath = resolve('src/data/regex', fileName);
        regexes.push(require(regexPath));
    }
    return regexes.flat();
}

(function () {
    const data = getRegexes();
    const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
    const string = JSON.stringify(sorted).replace(/"tags": ?null/g, '"tags": []');
    return writeFileSync(resolve(__dirname, '../src/data/regexes.json'), string);
})();