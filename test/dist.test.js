const { what } = require('../dist/what');

test('Browser', function () {
    const match = what.is('e@mail.com');
    expect(match.map(m => m.name)).toContain('Email Address');
})