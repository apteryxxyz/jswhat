<p align="center">
    <img alt="jsWhat" src=".github/logo.png"><br>
    <i>The easiest way to identify anything</i><br>
    <code>npm install jswhat</code>
</p>

<p align="center">
    <a href="https://github.com/apteryxxyz/jswhat/"><img alt="jswhat version" src="https://img.shields.io/badge/version-2.0.0-red"></a>
    <a href="https://npmjs.com/package/jswhat"><img alt="total downloads" src="https://img.shields.io/npm/dt/jswhat"></a>
    <br>
    <a href="https://github.com/apteryxxyz/jswhat/"><img alt="javascript percentage" src="https://img.shields.io/github/languages/top/apteryxxyz/jswhat"></a>
    <a href="https://bundlephobia.com/package/jswhat"><img alt="jswhat code size" src="https://img.shields.io/bundlephobia/minzip/jswhat?label=code%20size"></a>
    <a href="https://github.com/apteryxxyz/jswhat/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/npm/l/jswhat"></a>
    <br>
    <a href="https://github.com/apteryxxyz/jswhat/"><img alt="github commit activity" src="https://img.shields.io/github/commit-activity/m/apteryxxyz/jswhat"></a>
    <a href="https://prettier.io/"><img alt="code style prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4"></a>
    <br>
    <a href="https://github.com/apteryxxyz"><img alt="apteryxxyz followers" src="https://img.shields.io/github/followers/apteryxxyz?style=social"></a>
    <a href="https://github.com/apteryxxyz/jswhat"><img alt="jswhat repo stars" src="https://img.shields.io/github/stars/apteryxxyz/jswhat?style=social"></a>
</p>

# 🤔 What is `what`?

`JSWhat` is a JavaScript version of the existing [pyWhat](https://github.com/bee-san/pywhat). Built in TypeScript, this works in Node, the browser and the command line.

Have you ever come across a mysterious 🧙‍♂️ piece of text and wondered what it might be? Perhaps something like `rBxwE6ivExFJjRPh5cZtpq1ghTDm6cV5YP` or `2001:0db8:85a3:0000:0000:8a2e:0370:7334`?
Well with `what` all you have to do is ask via one of the three available methods and it will tell you! Simply feed `what` one or more pieces of text and it will try to identify them.

`what`s' job is to help you by identifing what something is.

You can view some examples [here](https://github.com/apteryxxyz/jswhat/tree/main/examples).

# 🏓 Table Of Contents

- [🤔 What is `what`?](#-what-is-what)
- [🏓 Table Of Contents](#-table-of-contents)
- [📩 Installation](#-installation)
    - [Command Line](#command-line)
    - [Node](#node)
    - [Browser](#browser)
- [🍕 API](#-api)
  - [💻 Command Line](#-command-line)
    - [Usage](#usage)
    - [Options](#options)
    - [Inputs](#inputs)
  - [🟢 Node](#-node)
    - [Usage](#usage-1)
    - [Output](#output)
  - [📺 Browser](#-browser)

# 📩 Installation

### Command Line

```bash
npm install jswhat --global
yarn global add jswhat
pnpm add jswhat --global
```

### Node

```bash
npm install jswhat
yarn add jswhat
pnpm add jswhat
```

### Browser

```html
<script src="https://unpkg.com/jswhat@2.0.0/dist/index.js"></script>
```

# 🍕 API

## 💻 Command Line

Once installed globally, you will gain access to the `what` command. You can use `what --help` to see a basic help menu containing usage, option information and examples.

### Usage

`what <inputs> [options]`

### Options

```
 -h, --help      Show this help message.
 -v, --version   Show the version number.
 -s, --search    Search within each input for more results.
 --rarity        Filter the results by rarity, one or two numbers from 0 and 1, searated by commas.
 --filter        Filter the results by name, short name, category, or tags, separated by commas.
 --exclude       Exclude the results by name, short name, category, or tags, separated by commas.
```

### Inputs

When wanting to identify some basic text, just type `what <inputs>` and it will try to identify what it is, simple right? You can identify more than one piece of text at once, just separate them with spaces. If your input has spaces, you can use quotes to enclose it.

## 🟢 Node

The node module is very simple to use, containing only a single method.

### Usage

```ts
const what = require('jswhat');
// OR
import what from 'jswhat';
```

`<what>.is(<inputs> [, options]);`

- `<inputs> {string|string[]}` The text to be identified.
- `[options.search] {boolean}` Search the inputs globally.
- `[options.rarity] {[number, number]}` Filter the results by rarity.
- `[options.filter] {string[]}` Names or tags to filter results by.
- `[options.exclude] {string[]}` Names or tags to exclude from the results.

### Output

The above method returns an array containing objects in the format of:

```js
{
    "matched": string,              // The content that was matched
    "name": string,                 // Name of what was matched
    "shortName": string,            // A shorter name for what was matched
    "category": string,             // Category of the matched content
    "tags": string[],               // Tags for what was matched
    "description": string | null,   // Description of what was matched
    "rarity": number | null,        // A number between 0 and 1 representing the rarity
    "url": string | null,           // URL to potently more information
    "regex": RegExp,                // The RegExp that was used to match this
}
```

## 📺 Browser

`jsWhat` works in the exact same way in the browser as in Node.

```html
<script src="https://unpkg.com/jswhat@2.0.0/dist/index.js"></script>
```

View the [Node section](#-node) for usage and options.