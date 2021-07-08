module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
        'shared-node-browser': true,
        amd: true,
        jest: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    parserOptions: {
        ecmaVersion: 6,
    },
    rules: {
        // native
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'no-empty': 'error',
    },
};
