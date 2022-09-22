import type { Options, Item, Match } from './types';

import Credentials from './data/credentials.json';
import CreditCards from './data/credit-cards.json';
import Cryptocurrency from './data/cryptocurrency.json';
import CyberSecurity from './data/cyber-security.json';
import Identifiers from './data/identifiers.json';
import Other from './data/other.json';
import SocialMedia from './data/social-media.json';
import PhoneCodes from './data/phone-codes.json';
export const Regexes = [
    ...Credentials,
    ...CreditCards,
    ...Cryptocurrency,
    ...CyberSecurity,
    ...Identifiers,
    ...Other,
    ...SocialMedia,
];

function formatRegexes(options: Options): Item[] {
    // Format the regexes based on the options
    let formattedRegexes = (Regexes as Item[])
        .map(item => {
            const copy = Object.assign({}, item);
            const boundary = `^${item.regex}$`;
            let { flags } = copy;

            if (options.search) flags += 'g';
            else copy.regex = boundary;

            if (item.rarity && (options.rarity[0] !== 0 || options.rarity[1] !== 1)) {
                const [min, max] = options.rarity;
                if (item.rarity < min || item.rarity > max) return null;
            }

            copy.expression = new RegExp(copy.regex, flags);
            return copy;
        })
        .filter(x => x !== null) as Item[];

    // Filter the regexes based on the options
    if (options.filter.length > 0) {
        const filter = options.filter.map(x => x.toLowerCase());
        formattedRegexes = formattedRegexes.filter(item => {
            let keep = false;
            for (let i = 0; i < filter.length && !keep; i++) {
                keep = [item.name, item.short, item.category, item.tags]
                    .flat()
                    .map(x => x.toLowerCase())
                    .includes(filter[i]);
            }
            return keep;
        });
    }

    // Exclude regexes based on the options
    if (options.exclude.length > 0) {
        const exclude = options.exclude.map(x => x.toLowerCase());
        formattedRegexes = formattedRegexes.filter(item => {
            let keep = true;
            for (let i = 0; i < exclude.length && keep; i++) {
                keep = ![item.name, item.short, item.category, item.tags]
                    .flat()
                    .map(x => x.toLowerCase())
                    .includes(exclude[i]);
            }
            return keep;
        });
    }

    return formattedRegexes;
}

export function identify(inputs: string[], options: Options): Match[] {
    const regexes = formatRegexes(options);
    const identified: Match[] = [];

    // Loop over each of the inputs
    for (const input of inputs) {
        // For each of the inputs, loop over every regex
        for (const identifier of regexes) {
            const matches = input.match(identifier.expression);
            let matched: any[];

            if (!matches) {
                continue;
            } else if (matches.input) {
                matched = [matches];
            } else {
                const regex = new RegExp(identifier.regex, identifier.flags);
                matched = matches.map(m => m.match(regex));
            }

            // Loop over each of the matches
            for (const _match of matched) {
                if (!_match) continue;
                const match = [_match].flat();
                let url = `${identifier.url}`;
                let description = `${identifier.description}`;

                // If a phone number was matched,
                // set the description to its location
                if (identifier.name === 'Phone Number') {
                    const locations: string[] = [];

                    for (const phone of PhoneCodes) {
                        if (match[0].trim().includes(phone.code)) {
                            locations.push(phone.country);
                        }
                    }

                    if (locations.length >= 1) {
                        description = `Locations(s): ${locations.join(', ')}`;
                    }
                    // If no locations, then it is not a valid phone number
                    else continue;
                }

                if (url && match && url.includes('{')) {
                    for (let m = 0; m < 10; m++) {
                        if (!match[m]) continue;
                        url = url.replace(`{${m}}`, match[m]);
                    }

                    // If the URL doesnt contain a protocol, add one
                    if (!/^https?:\/\//i.test(url)) url = `http://${url}`;
                }

                // Add the boundary to the regex if it doesn't have it
                const regex = identifier.regex.startsWith('^')
                    ? identifier.regex
                    : `^${identifier.regex}$`;

                identified.push({
                    matched: match[0],
                    name: identifier.name,
                    shortName: identifier.short,
                    category: identifier.category,
                    description,
                    rarity: identifier.rarity,
                    url,
                    regex: new RegExp(regex, identifier.flags),
                    tags: identifier.tags,
                });
            }
        }
    }

    return identified;
}
