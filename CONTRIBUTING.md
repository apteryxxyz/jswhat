<p align="center">
  <img alt="jswhat" src=".github/logo.png"><br>
  <img alt="changelog" src=".github/contributing.png">
</p>

We are open to, and grateful for, any contributions made by the community. By contributing to jsWhat, you agree to abide by the [code of conduct](./CODE_OF_CONDUCT.md).

## Code Style

The code is automatically styled and formatted using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) when using the command `npm run build`.

## Commit Messages

Comment messages should start with an emoji based on the [this](https://gist.github.com/parmentf/035de27d6ed1dce0b36a).

Use past commit messages for examples.

### Testing

Please update the tests to reflect your code changes. If you are adding a regex, always add a test/example.

### Documentation

Please update the [docs](./README.md) accordingly so that there are no discrepancies between the API and the documentation.

### Developing

- `npm test` = run the Jest tests.
- `npm build` = build the module, combining all code into a single file in `dist/`.

Please do not include changes to the `dist/` folder. This should only be updated when releasing a new version.
