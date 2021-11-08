#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const namesToIgnore = ['YouTube Video'];

(function $() {
    const allRegexes = require('../data/regexes.json');

    return fetch('https://raw.githubusercontent.com/bee-san/pyWhat/main/pywhat/Data/regex.json')
        .then(res => res.json())
        .then(eRegexes => {
            // Sync local variables with external variables
            const currentNames = allRegexes.map(r => r.name);
            const externalNames = eRegexes.map(r => r.name);

            if (externalNames.some(n => !currentNames.includes(n))) {
                const missingRegexes = eRegexes
                    .filter(r => !currentNames.includes(r.Name) && !namesToIgnore.includes(r.Name))
                    .map(r => r.name);
                fs.writeFileSync(path.resolve(__dirname, '../data/to-add.json'),
                    JSON.stringify(missingRegexes, null, 4));
                console.log('\x1b[33m%s\x1b[0m',
                    `There are currently ${missingRegexes.length} regexes that need to be added!`);
            }

            // Sync local variables with external variables
            const directory = fs.readdirSync(path.resolve(__dirname, '../data/regexes'));
            for (let i = 0; i < directory.length; i++) {
                const filePath = path.resolve(__dirname, '../data/regexes', directory[i]);
                const localRegexes = JSON.parse(fs.readFileSync(filePath));

                for (let j = 0; j < localRegexes.length; j++) {
                    const lRegex = localRegexes[j];
                    const eRegex = eRegexes
                        .find(r => [lRegex.name, lRegex.short]
                            .map(s => s.toLowerCase())
                            .includes(r.Name.toLowerCase()));

                    if (
                        eRegex &&
                        eRegex.Examples?.Valid?.some(e => !lRegex.tests.includes(e))
                    ) {
                        lRegex.tests = lRegex.tests
                            .concat(eRegex.Examples?.Valid)
                            .filter((v, d, a) => a.indexOf(v) === d);
                    }

                    if (eRegex && typeof eRegex.Rarity === 'number') {
                        lRegex.rarity = eRegex.Rarity;
                        if (typeof lRegex.rarity !== 'number') {
                            console.log('\x1b[33m%s\x1b[0m',
                                `Could not find rarity for regex ${lRegex.short}`);
                        }
                    }

                    if (eRegex && eRegex.Description) {
                        lRegex.description = eRegex.Description.replace(/\[(\/?#[A-Z0-9]+|\/?link(=[^ ]+)?|)\]/g, '');
                    }

                    localRegexes[j] = lRegex;
                }

                fs.writeFileSync(filePath, JSON.stringify(localRegexes, null, 4));
            }
        });
}());
