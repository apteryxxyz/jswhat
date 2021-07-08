console.log('DENO', '\n');

import { createRequire } from 'https://deno.land/std/node/module.ts';
const require = createRequire(import.meta.url);
const what = require('jswhat');

// general usage
var match = what.is('hot@mail.com')[0];
console.log('Simply match an email only\n', match.matched, '\n');

// search within a string
var matches = what.is('hot@mail.com g@mail.com e@mail.com', true);
console.log(
    'Find every possible match within\n',
    matches.matched.join(', '),
    '\n'
);

// filter the output by a name, short name, category or tags
var filtered = what.is('hot@mail.com g@mail.com e@mail.com', true, {
    filter: 'Email',
});
console.log(
    'Only match possible email addresses\n',
    filtered.matched.join(', '),
    '\n'
);

// exclude a name, short name, category or tag from the output
var excluded = what.is(
    'hot@mail.com g@mail.com https://youtube.com/pewdiepie',
    true,
    { exclude: ['URL', 'YouTube'] }
);
console.log(
    'Exclude a property from the results, in this case URLs and YouTube related\n',
    excluded.matched,
    '\n'
);

try {
    what.is(null, null, { throwError: true });
} catch (error) {
    console.log(
        'Text argument is null so this will throw an error\n',
        error.message,
        '\n'
    );
}

// read text from a file
var read = what.is('package.json', true, { nonText: true });
if (read.error) console.log(read.error, '\n');
else console.log('Read text from the package.json file\n', read.tags, '\n');

// fetch text from a url
var fetched = what.is(
    'https://raw.githubusercontent.com/apteryxxyz/jswhat/main/package.json',
    true,
    { nonText: true }
);
if (fetched.error) console.log(fetched.error);
else
    fetched.then(function (data) {
        console.log(
            'Match text fetch from a URL\n',
            'Matches(' + data.length + ')'
        );
    });
