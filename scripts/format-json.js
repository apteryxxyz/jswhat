#!/usr/bin/env node
(function () {
    const readdirSync = require('fs').readdirSync;
    const writeFileSync = require('fs').writeFileSync;
    const resolve = require('path').resolve;

    const toFormat = [
        ['src/data/phone_codes.json', ['country', 'code']],
        [
            'src/data/regex/*',
            [
                'name',
                'short',
                'category',
                'description',
                'url',
                'regex',
                'flags',
                'test',
                'tags',
            ],
        ],
    ];

    for (var i = 0; i < toFormat.length; i++) {
        var f = toFormat[i];
        (function format(path, schema, property) {
            if (path.endsWith('*')) {
                path = resolve(__dirname, '../' + path.replace(/\*/gi, ''));
                const directory = readdirSync(path);
                for (const fileName of directory) {
                    format(resolve(path, fileName), schema, property);
                }
                return;
            }

            path = resolve(path);
            const data = require(path);
            let category = data.find((d) => !!d.category);
            while (category && category.category) category = category.category;

            for (let i = 0; i < data.length; i++) {
                let d = {},
                    o = data[i];
                for (const k of schema) {
                    if (k === 'short')
                        d[k] = o[k] || o['shortName'] || o['name'];
                    else if (k == 'category' && category) d[k] = category;
                    else if (k == 'tags')
                        d[k] = (o[k] || []).sort((a, b) => a.localeCompare(b));
                    else d[k] = o[k] || '';
                }
                data[i] = d;
            }

            const sorted = data.sort((a, b) =>
                a[property].localeCompare(b[property])
            );
            const string = JSON.stringify(sorted).replace(
                /"tags": ?null/g,
                '"tags": []'
            );
            return writeFileSync(path, string);
        })(f[0], f[1], f[1][0]);
    }
})();
