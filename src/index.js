const identify = require('./identify');
const url = require('./url');
const path = require('./path');
const pkg = require('../package.json');

/* eslint-disable no-undef */
// Determine the environment
// Used to disable features on unsupported environment
const environment =
    typeof process?.versions?.node !== 'undefined' ? 'node' :
        typeof window?.document !== 'undefined' ? 'browser' :
            'unknown';
/* eslint-enable no-undef */

Object.defineProperties(module.exports, {
    identify: { value: identify },
    url: { value: url },
    path: { value: path },
    version: { value: pkg.version },
    environment: { value: environment },
});

const defaultOptions = {
    nonText: false,
    search: false,
    rarity: [0, 1],
    filter: [],
    exclude: [],
};

module.exports.is = function is(input, options) {
    // Verify the options are valid
    if (options && typeof options !== 'object') {
        throw new TypeError(`[${pkg.name}] Invalid parameter 'options', must be an object or undefined`);
    }
    options = Object.assign({}, defaultOptions, options);

    // Verify the inputs are valid
    const inputs = [input].flat();
    if (!input) {
        throw new Error('Missing parameter \'input\'');
    } else if (inputs.some(i => typeof i !== 'string' && !(i instanceof Promise))) {
        throw new TypeError(`[${pkg.name}] Invalid parameter 'input', must be either a string or an array of inputs`);
    }

    let strings = [];
    if (options.nonText) {
        const links = inputs.filter(s => url(s));
        const files = inputs.filter(s => path(s));
        if (files.length > 0 && environment === 'browser') {
            console.warn(`[${pkg.name}] reading files is not supported in the browser`);
        }

        for (let i = 0; i < links.length; i++) strings.push(url(links[i]).fetch());
        for (let i = 0; i < files.length; i++) strings.push(path(files[i]).read());
    } else { strings = inputs; }
    strings = strings.flat();

    if (strings.length === 0) return [];
    // If the inputs contain a Promise, resolve then continue
    if (strings.some(t => t instanceof Promise)) {
        return Promise.all(strings).then(strs => identify(strs.flat(), options));
    } else { return identify(strings, options); }
};
