const what = require('../src');

// general usage
const match = what.is('hot@mail.com')[0];
console.log(1, match.name, match.matched);

// search within a string for matches
const matches = what.is('DME1MJ1UQdiUp7shpN5crRnH3Vibp2iPQm', true);
console.log(2, matches.names, matches.matched);

// exclude email addresses from the output
const emailDomains = what.is('hot@mail.com g@mail.com', true, { exclude: 'Email Address' });
console.log(3, emailDomains.matched);

// remove everything but email addresses
const emailAddresses = what.is('hot@mail.com g@mail.com', true, { filter: 'Email Address' });
console.log(4, emailAddresses.matched);

(async function () {
    const googleMatches = await what.is('https://www.google.com', false, { nontext: true });
    console.log(5, `Matches(${googleMatches.length})`);
})();
