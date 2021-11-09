const phoneCodes = require('../data/phone-codes.json');
const regexes = require('../data/regexes.json');

module.exports = function $(inputs, options = {}) {
    const timer = Date.now();
    const strings = [inputs].flat();

    // Verify that inputs are valid
    if (strings.some(x => typeof x !== 'string' && !(x instanceof Promise))) {
        throw new Error('Invalid \'inputs\', must be an array of strings');
    }

    // Verify options are valid
    if (!Array.isArray(options.exclude) || options.exclude.some(x => typeof x !== 'string')) {
        throw new TypeError('Invalid \'options.exclude\', must be an array of strings');
    } else if (!Array.isArray(options.filter) || options.filter.some(x => typeof x !== 'string')) {
        throw new TypeError('Invalid \'options.filter\', must be an array of strings');
    } else if (typeof options.search !== 'boolean') {
        throw new TypeError('Invalid \'options.search\', must be a boolean');
    } else if (!Array.isArray(options.rarity) || options.rarity.some(x => typeof x !== 'number' || x < 0 || x > 1)) {
        throw new TypeError('Invalid \'options.rarity\', must be an array of one or two numbers, each between 0 and 1');
    }

    let formattedRegexes = regexes.map(item => {
        const copy = Object.assign({}, item);
        let flags = item.flags;
        copy.boundary = `^${item.regex}$`;

        if (!options.search) copy.regex = copy.boundary;
        else flags += 'g';

        if (options.rarity[0] !== 0 || options.rarity[1] !== 1) {
            if (options.rarity.length === 1) options.rarity = [options.rarity[0], options.rarity[0]];
            if (item.rarity < options.rarity[0] || item.rarity > options.rarity[1]) {
                return null;
            }
        }

        copy.expression = new RegExp(copy.regex, flags);
        return copy;
    }).filter(Boolean);

    // Filter the regexes
    if (options.filter.length > 0) {
        const filter = options.filter.map(x => x.toLowerCase());
        formattedRegexes = formattedRegexes.filter(item => {
            let keep = false;
            for (let i = 0; i < filter.length && keep !== true; i++) {
                keep = [item.name, item.short, item.category, item.tags]
                    .flat().some(x => x.toLowerCase().includes(filter[i]));
            }
            return keep;
        });
    }

    // Exclude some regexes from the results
    if (options.exclude.length > 0) {
        const exclude = options.exclude.map(x => x.toLowerCase());
        formattedRegexes = formattedRegexes.filter(item => {
            let keep = true;
            for (let i = 0; i < exclude.length && keep !== false; i++) {
                keep = ![item.name, item.short, item.category, item.tags]
                    .flat().some(x => x.toLowerCase().includes(exclude[i]));
            }
            return keep;
        });
    }

    const matches = [];
    for (let i = 0; i < strings.length; i++) {
        const string = strings[i];

        for (let j = 0; j < formattedRegexes.length; j++) {
            const item = formattedRegexes[j];
            let matched = string.match(item.expression);
            if (!matched) continue;
            else if (!matched.input) matched.map(x => x.match(new RegExp(item.regex, item.flags)));
            else matched = [matched];

            for (let k = 0; k < matched.length; k++) {
                let match = matched[k];
                if (!Array.isArray(match)) match = [match];
                let url = item.url;
                let description = item.description;

                if (item.name === 'Phone Number') {
                    const locations = [];

                    for (let l = 0; l < phoneCodes.length; l++) {
                        const phone = phoneCodes[l];
                        if (match[0].trim().includes(phone.code)) locations.push(phone.country);
                    }

                    if (locations.length >= 1) {
                        description = `Location(s): ${locations.join(', ')}`;
                    }
                }

                if (item.url && item.url.split('').includes('{')) {
                    for (let m = 0; m < 10; m++) {
                        if (!match[0]) continue;
                        else url = url.replace(new RegExp(`\\{${m}\\}`, 'g'), match[m]);
                    }
                    // Add http to the url if it is missing it
                    if (!/^https?:\/\//i.test(url)) url = `http://${url}`;
                }

                matches.push({
                    matched: match[0],
                    name: item.name,
                    short: item.short,
                    category: item.category,
                    description,
                    rarity: item.rarity,
                    url,
                    regex: new RegExp(item.boundary, item.flags),
                    tags: item.tags,
                });
            }
        }
    }

    matches.time = Date.now() - timer;
    matches.names = matches.map(m => m.name);
    matches.short = matches.map(m => m.short);
    matches.matched = matches.map(m => m.matched);
    matches.tags = matches.map(m => m.tags).flat().filter((x, i, a) => a.indexOf(x) === i);
    return matches;
};

Object.defineProperty(module.exports, 'regexes', { value: regexes });
