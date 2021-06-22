class RegexIdentifier {
    constructor(what) {
        this.what = what;
        this.regexes = require('./data/regexes.json');
        this.phoneCodes = require('./data/phone_codes.json');
        const tags = [].concat.apply([], this.regexes.map(r => r.tags || []));
        this.tags = tags.filter((v, i, s) => s.indexOf(v) === i);

        this.Matched = class Matched extends Array {
            constructor(text, error) {
                super();
                Object.defineProperties(this, {
                    text: { value: text },
                    error: { valu: error }
                })
            }

            get names() {
                this.map(m => m.name);
            }

            get tags() {
                [].concat.apply([], this.map(m => m.tags));
            }
        }
    }

    check(strings, options = {}) {
        const timer = Date.now();
        if (typeof strings === 'string') strings = [strings];
        const matched = new this.Matched(strings);

        if (!Array.isArray(strings) && typeof strings !== 'string')
            matched.error = new Error(`[jswhat] Parameter 'text' must be an array or string`);
        if (options.search && typeof options.search !== 'boolean')
            matched.error = new Error(`[jswhat] Option 'search' must be a boolean`);
        if (options.include && (!Array.isArray(options.include) && typeof options.include !== 'string'))
            matched.error = new Error(`[jswhat] Option 'include' must be an array or string`);
        if (options.exclude && (!Array.isArray(options.exclude) && typeof options.exclude !== 'string'))
            matched.error = new Error(`[jswhat] Option 'exclude' must be an array or string`);
        if (matched.error) return matched;

        let regexes = this.regexes.map(({ name, description, url, tags, flags, regex }) => {
            const wholeRegex = `^${regex}$`;
            let newFlags = flags;
            if (options.search !== true) regex = wholeRegex;
            if (options.search === true) newFlags += 'g';
            const expression = new RegExp(regex, newFlags || '');
            return { name, description, url, tags, regex, boundary: wholeRegex, flags, expression }
        })

        if (options.filter) {
            const filter = [].concat.apply([], [options.filter]).map(e => e.trim().toLowerCase());
            regexes = regexes.filter(r => {
                let keep = false;
                for (let i = 0; i < filter.length && keep !== true; i++)
                    keep = [r.name, ...r.tags].map(t => t.toLowerCase()).includes(filter[i]);
                return keep;
            })
        }

        if (options.exclude) {
            const exclude = [].concat.apply([], [options.exclude]).map(e => e.trim().toLowerCase());
            console.log(exclude)
            regexes = regexes.filter(r => {
                let keep = true;
                for (let i = 0; i < exclude.length && keep !== false; i++)
                    keep = ![r.name, ...r.tags].map(t => t.toLowerCase()).includes(exclude[i]);
                return keep;
            })
        }

        for (const string of strings) {
            for (let { name, description, url, tags, regex, flags, expression, boundary } of regexes) {
                let matches = string.match(expression);
                if (!matches) continue;
                else if (!matches.input) matches = matches.map(m =>
                    m.match(new RegExp(regex, flags)));
                else matches = [matches];

                for (const match of matches) {
                    Object.assign(match, { url, description });

                    if (name === 'Phone Number') {
                        const locations = [];
                        for (const phone of this.phoneCodes)
                            if (match[0].trim().includes(phone.code))
                                locations.push(phone.country);
                        if (locations.length >= 1)
                            match.description = `Location(s): ${locations.join(', ')}`.trim();
                    }

                    if (url && url.includes('{'))
                        for (let i = 0; i < 10; i++) {
                            if (!match[i]) continue;
                            else match.url = match.url.replace(new RegExp(`\\{${i}\\}`, 'g'), match[i] || '');
                        }

                    matched.push({
                        matched: match[0],
                        name: name,
                        description: match.description,
                        regex: new RegExp(boundary, flags),
                        url: match.url,
                        tags: tags
                    })
                }
            }
        }

        matched.time = Date.now() - timer;
        return matched;
    }
}

module.exports = exports = RegexIdentifier;