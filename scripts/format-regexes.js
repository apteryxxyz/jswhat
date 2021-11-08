#! /usr/bin/env node

const fs = require('fs');
const path = require('path');

function rk(r) {
    return {
        name: r.name,
        short: r.short,
        category: r.category,
        description: r.description,
        rarity: r.rarity,
        url: r.url,
        regex: !r.regex.endsWith(')') ? `(?:${r.regex})` : r.regex,
        flags: r.flags,
        tests: [r.test ?? r.tests].flat().filter(Boolean),
        tags: [r.tags].flat(),
    };
}

(function $() {
    const dir = fs.readdirSync(path.resolve(__dirname, '../data/regexes'));
    for (const file of dir) {
        const regexPath = path.resolve(__dirname, '../data/regexes', file);
        const regexes = require(regexPath).map(rk);

        const sorted = regexes
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(r => ({ ...r, tests: r.tests.sort((a, b) => a.localeCompare(b)) }));
        const string = JSON.stringify(sorted, null, 4);
        fs.writeFileSync(regexPath, string);
    }
}());
