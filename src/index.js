const RegexIdentifier = require('./regex');
const FileHandler = require('./file');
const URLHandler = require('./url');

class What {
    constructor() {
        this.regex = new RegexIdentifier(this);
        this.file = new FileHandler();
        this.url = new URLHandler();
    }

    /**
     * Identify anything.
     * @param {string|string[]} text Content to be identified.
     * @param {boolean} search Wether or not to search the content globally.
     * @param {object} options Extra options.
     * @param {boolean} [options.nontext] Wether or not the text should be treated as a file path or URL.
     * @param {string|string[]} [options.filter] A string or array of names or tags to filter results by.
     * @param {string|string[]} [options.exclude] A string or array of names or tags to exclude from the results.
     * @returns {object[]} If successful, an array containing objects with what was identified,
     * if it is unsuccessfully, the result will have an error property.
     */
    is(text, search = false, { nontext = false, filter = '', exclude = '' } = {}) {
        if (!text) text = new Error('[jswhat] Missing or invalid argument \'text\'');

        else if (Array.isArray(text) || typeof text === 'string') {
            if (!nontext) text = [].concat.apply([], text);
            else {
                // this returns a promsie which gets handled later
                if (this.url.isURL(text)) text = this.url.fetchURL(text);
                else if (this.file.isFile(text[0])) text = this.file.readFile(text[0]);
                else text = Error(`[jswhat] Invalid file path or URL: ${text}`);
            }
        } else text = new Error(`[jswhat] Parameter 'text' must be an array or string`);

        const self = this;
        function check(strings) {
            if (strings instanceof Error) return new self.regex.Matched(undefined, strings);
            return self.regex.check(strings, { search, nontext, filter, exclude });
        }

        // in the case fetchURL returns a promise, this will await it before
        // running the 'regex.check' check method
        if (text instanceof Promise) return (async function () { return check(await text) })();
        else return check(text);
    }
}

module.exports = new What();