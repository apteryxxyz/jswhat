#! /usr/bin/env node

const fs = require('fs');
const path = require('path');

(function $() {
    const dir = fs.readdirSync(path.resolve(__dirname, '../data/regexes'));
    const data = Object.assign([], dir.map(file => {
        const regexPath = path.resolve(__dirname, '../data/regexes', file);
        return JSON.parse(fs.readFileSync(regexPath).toString());
    })).flat();

    console.log('\x1b[33m%s\x1b[0m', `There are currently ${data.length} regexes locally!`);
    const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
    const string = JSON.stringify(sorted, null, 4);
    return fs.writeFileSync(path.resolve(__dirname, '../data/regexes.json'), string);
}());
