#! /usr/bin/env node

import what from '../src';
import type { Match } from '../src';
const timer = Date.now();

const ShortRegex = /^-([^\d-]+)$/;
const LongRegex = /^--(\S+)=(.*)$/;
const Regexes = [ShortRegex, LongRegex];

const Options = [
    {
        name: ['help', 'h'],
        value: 'boolean',
        description: 'Show this help message.',
    },
    {
        name: ['version', 'v'],
        value: 'boolean',
        description: 'Show the version number.',
    },
    {
        name: ['search', 's'],
        value: 'boolean',
        description: 'Search within each input for more results.',
    },
    {
        name: ['rarity', 'r'],
        value: (s: string) => s.split(',').slice(0, 2).map(Number),
        description:
            'Filter the results by rarity, one or two numbers from 0 and 1, searated by commas.',
    },
    {
        name: ['filter', 'f'],
        value: (s: string) => s.split(',').map(s => s.trim()),
        description:
            'Filter the results by name, short name, category, or tags, separated by commas.',
    },
    {
        name: ['exclude', 'e'],
        value: (s: string) => s.split(',').map(s => s.trim()),
        description:
            'Exclude the results by name, short name, category, or tags, separated by commas.',
    },
];

function parseOptions(args: string[]): Record<string, any> {
    const options = {};
    const flags = args
        .map(a => Regexes.map(r => a.match(r)))
        .flat()
        .filter(Boolean) as RegExpMatchArray[];

    function parseOption(name: string, value: any) {
        const option = Options.find(o => o.name.includes(name));
        if (!option) return;

        if (option.value === 'boolean') {
            Reflect.set(options, option.name[0], true);
        } else if (typeof option.value === 'function') {
            const result = Reflect.get(option, 'value')(value);
            Reflect.set(options, option.name[0], result);
        } else {
            Reflect.set(options, option.name[0], value);
        }
    }

    for (const flag of flags) {
        if (ShortRegex.test(flag[0])) {
            flag[1].split('').forEach(f => parseOption(f, true));
        } else if (LongRegex.test(flag[0])) {
            parseOption(flag[1], flag[2]);
        }
    }

    return options;
}

function handleError(error: Error | string) {
    const message = typeof error === 'string' ? error : error.message;
    console.error('\x1b[31m%s\x1b[0m', `\n${message.toString()}\nTook: ${Date.now() - timer}ms`);
}

void (function _() {
    try {
        const args = process.argv.slice(2);
        const options = parseOptions(args);
        const inputs = args.filter(a => !a.startsWith('-'));

        if (options.version) return console.info(what.version);

        if (!inputs.length || options.help) {
            return console.log(
                (function _() {
                    return `${
                        '\njsWhat - Identify what something is.\n' +
                        'Created by Apteryx (https://github.com/apteryxxyz)\n' +
                        'Based on pyWhat (https://github.com/bee-san/pyWhat)\n' +
                        '\nUsage: what <inputs> [options]\n\n' +
                        'Options:\n'
                    }${Options.map(o => {
                        let string = ' ';
                        let count = 20 - o.name[0].length;
                        if (o.name[1]) {
                            string += `-${o.name[1]}, `;
                            count -= 4;
                        }
                        return `${string}--${o.name[0] + ' '.repeat(count) + o.description}`;
                    }).join('\n')}\n\nExamples:\n${[
                        '192.168.0.2',
                        'e@mail.com --search',
                        'dQw4w9WgXcQ --filter=media',
                        'path/to/file --nontext --search',
                        'https://raw.github.com/apteryxxyz/jswhat/main/README.md -ns',
                        '--tags',
                        'e@mail.com g@mail.com fakemail.com -s --filter="Email Address"',
                        'e@mail.com g@mail.com hot@mail.com mail.google.com -s --exclude="Email"',
                    ]
                        .map(e => ` * what ${e}`)
                        .join('\n')}\n`;
                })()
            );
        }

        return new Promise<Match[]>((resolve, reject) => {
            const results = what.is(inputs, options);
            Promise.resolve(results).then(resolve).catch(reject);
        })
            .then((data: Match[]) => {
                if (data.length === 0) return handleError('Zero matches found!');
                const matches = data.length > 50 ? data.slice(0, 50) : data;

                let header = '\nPossible Identification';
                if (data.length > 50) header += `Showing 50/${data.length} matches.\n`;
                console.log('\x1b[36m%s\x1b[0m', header, '\n');

                console.table(
                    matches.map(m => ({
                        'Matched at': m.matched,
                        'Identified as': m.shortName,
                        Description: m.description || 'None',
                        URL: m.url || 'None',
                    })),
                    ['Matched at', 'Identified as', 'Description', 'URL']
                );

                if (data.length > 25) console.log('\x1b[36m%s\x1b[0m', header);
                return console.log(`\nTook: ${Date.now() - timer}ms`);
            })
            .catch(handleError);
    } catch (error) {
        handleError(error as Error);
    }
})();
