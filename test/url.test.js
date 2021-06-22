const URLHandler = require('../src/url');
const url = new URLHandler();

test('Is URL', function () {
    const path = 'https://data.iana.org/TLD/tlds-alpha-by-domain.txt';
    expect(url.isURL(path)).toBe(true);
})

test('Fetch URL', async function () {
    const path = 'https://data.iana.org/TLD/tlds-alpha-by-domain.txt';
    const content = await url.fetchURL(path);
    expect(content[0]).toBe('#');
})