/**
 * Options to pass to the is function.
 */
export interface Options {
    /** Whether to deeply search within a string. */
    search: boolean;
    /** Array of names, short names, categories or tags to exclude. */
    exclude: string[];
    /** Array of names, short names, categories or tags to filter matches by. */
    filter: string[];
    /** Range of rarity or filter for. */
    rarity: [number, number];
}

/** @private */
export interface Item {
    name: string;
    short: string;
    category: Category;
    description: string | null;
    url: string | null;
    rarity: number | null;
    regex: string;
    expression: RegExp;
    flags: string;
    tests: any[];
    tags: Tag[];
}

export interface Match {
    /** Content that was matched. */
    matched: string;
    /** Name of what was matched. */
    name: string;
    /** A shorter name for what was matched. */
    shortName: string;
    /** Category for what was matched. */
    category: Category;
    /** Description of what was matched. */
    description: string | null;
    /** Rarity of what was matched. */
    rarity: number | null;
    /** URL to potently more information. */
    url: string | null;
    /** The RegExp that was used to match this. */
    regex: RegExp;
    /** Tags for what was matched. */
    tags: Tag[];
}

/**
 * Category for regex items.
 */
export type Category =
    | 'Credentials'
    | 'Credit Cards'
    | 'Cryptocurrency'
    | 'Cyber Security'
    | 'Identifiers'
    | 'Social Media';

/**
 * Tags for an regex items.
 */
export type Tag =
    | 'Amazon'
    | 'AWS'
    | 'Credential'
    | 'Secret'
    | 'Authorization'
    | 'Discord'
    | 'Discord'
    | 'Facebook'
    | 'Firebase'
    | 'Google'
    | 'GitHub'
    | 'OAuth'
    | 'Captcha'
    | 'Heroku'
    | 'Hacking'
    | 'JWT'
    | 'Security'
    | 'Website'
    | 'Mailgun'
    | 'Braintree'
    | 'PayPal'
    | 'Cyber Security'
    | 'Private Key'
    | 'PEM'
    | 'Bug Bounty'
    | 'PGP'
    | 'Public Key'
    | 'Slack'
    | 'Square'
    | 'Stripe'
    | 'Twilio'
    | 'Credit Card'
    | 'Finance'
    | 'Cryptocurrency'
    | 'Cryptocurrency Wallet'
    | 'Identifier'
    | 'Date'
    | 'Networking'
    | 'ObjectID'
    | 'Communication'
    | 'Internet'
    | 'Hex Color Value'
    | 'Hex Color'
    | 'Colour'
    | 'Color'
    | 'Geo-location'
    | 'UNIX'
    | 'Timestamp'
    | 'UNIX Timestamp'
    | 'Channel'
    | 'Media'
    | 'YouTube'
    | 'Video';
