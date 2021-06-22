const { writeFileSync, readdirSync } = require('fs');
const { resolve } = require('path');

const toFormat = [
    [
        'src/data/phone_codes.json',
        ['country', 'code']
    ],
    [
        'src/data/regex/*',
        ['name', 'description', 'url', 'regex', 'flags', 'test', 'tags']
    ]
]

function format(path, schema, property) {
    if (path.endsWith('*')) {
        path = resolve(path.replace(/\*/gi, ''));
        const directory = readdirSync(path);
        for (const fileName of directory)
            format(resolve(path, fileName), schema, property);
        return;
    }

    path = resolve(path);
    const data = require(path);

    for (let i = 0; i < data.length; i++) {
        let d = {}, o = data[i];
        for (const k of schema) d[k] = o[k] || '';
        data[i] = d;
    }

    const sorted = data.sort((a, b) => a[property].localeCompare(b[property]));
    const string = JSON.stringify(sorted).replace(/"tags": ?null/g, '"tags": []');
    return writeFileSync(path, string);
}

for (const f of toFormat) format(f[0], f[1], f[1][0]);