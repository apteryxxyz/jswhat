import pkg from '../package.json';
import { identify } from './identify';
export * from './identify';
import type { Match, Options } from './types';
export * from './types';

const defaultOptions: Options = {
    search: false,
    exclude: [],
    filter: [],
    rarity: [0, 1],
};

// Combine options with the defaults and verify that they are valid
function combineAndVerifyOptions(rawOptions: Partial<Options>): Options {
    const options = { ...defaultOptions, ...rawOptions };

    if (typeof options.search !== 'boolean') {
        throw new TypeError("Invalid 'options.search', must be a boolean");
    } else if (
        !Array.isArray(options.exclude) ||
        options.exclude.some(x => typeof x !== 'string')
    ) {
        throw new TypeError("Invalid 'options.exclude', must be an array of strings");
    } else if (!Array.isArray(options.filter) || options.filter.some(x => typeof x !== 'string')) {
        throw new TypeError("Invalid 'options.filter', must be an array of strings");
    } else if (
        !Array.isArray(options.rarity) ||
        options.rarity.some(x => typeof x !== 'number' || x < 0 || x > 1) ||
        options.rarity[0] > options.rarity[1]
    ) {
        throw new TypeError(
            "Invalid 'options.rarity', must be an array of two numbers, from 0 and 1"
        );
    }

    return options;
}

/**
 * Detect what a string is.
 * @param input The input string to search for matches
 * @param options Options to pass to the search
 */
export function is(input: string | string[], options: Partial<Options> = {}): Match[] {
    const inputs = [input].flat();
    if (inputs.some(i => typeof i !== 'string')) {
        throw new TypeError('Input must be a string or an array of strings');
    }

    const fOptions = combineAndVerifyOptions(options);
    if (inputs.length === 0) return [];
    return identify(inputs, fOptions);
}

/**
 * The version of the library.
 */
export const { version } = pkg;
