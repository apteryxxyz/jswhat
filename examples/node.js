const what = require('../');

// General usage
const match = what.is('fake@mail.com')[0];
console.log('Simply match an email only\n', match.matched);

// Search with a string
var matches = what.is('hot@mail.com g@mail.com e@mail.com', { search: true });
const sMatched = matches.map((m) => m.matched);
console.log('\nFind every possible match within\n', sMatched.join(', '));

// Filter the output by a name, short name, category or tag
const fOptions = { search: true, filter: ['Email'] };
const filtered = what.is('fake@mail.com g@mail.com e@mail.com', fOptions);
const fMatched = filtered.map((m) => m.matched);
console.log('\nOnly match possible email addresses\n', fMatched.join(', '));

// Exclude a name, short name, category or tag
const eOptions = { search: true, exclude: ['URL', 'YouTube'] };
const excluded = what.is('hot@mail.com g@mail.com https://youtube.com/pewdiepie', eOptions);
const eMatched = excluded.map((m) => m.matched);
console.log('\nExclude a property from the results, in this case URLs and YouTube related\n', eMatched.join(', '));
