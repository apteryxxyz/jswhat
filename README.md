<p align="center">
    <img alt="jsWhat" src=".github/logo.png"><br>
    <i>The easiest way to identify anything</i><br>
    <code>npm install jswhat</code>
</p>

<p align="center">
    <a href="https://github.com/apteryxxyz/jswhat/"><img alt="jswhat version" src="https://img.shields.io/badge/version-2.0.0-red"></a>
    <a href="https://npmjs.com/package/jswhat"><img alt="total downloads" src="https://img.shields.io/npm/dt/jswhat"></a>
    <!--<a href="https://npmjs.com/package/jswhat"><img alt="node version" src="https://img.shields.io/badge/node-10.0.0-lime"></a>
    <br>
    <a href="https://www.w3schools.com/js/js_es5.asp"><img alt="chrome version" src="https://img.shields.io/badge/chrome-23-yellow"></a>
    <a href="https://www.w3schools.com/js/js_es5.asp"><img alt="IE version" src="https://img.shields.io/badge/IE-10-blue"></a>
    <a href="https://www.w3schools.com/js/js_es5.asp"><img alt="edge version" src="https://img.shields.io/badge/edge-12-teal"></a>
    <a href="https://www.w3schools.com/js/js_es5.asp"><img alt="firefox version" src="https://img.shields.io/badge/firefox-21-orange"></a>
    <a href="https://www.w3schools.com/js/js_es5.asp"><img alt="safari version" src="https://img.shields.io/badge/safari-6-lightblue"></a>
    <a href="https://www.w3schools.com/js/js_es5.asp"><img alt="opera version" src="https://img.shields.io/badge/opera-15-red"></a>-->
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

# 🤔 `What` is what?

`jsWhat` is a JavaScript version of the existing [pyWhat](https://github.com/bee-san/pyWhat). Works in Node, the browser and the command line.

Have you ever come across a mysterious 🧙‍♂️ piece of text and wondered what it might be? Perhaps something like `rBxwE6ivExFJjRPh5cZtpq1ghTDm6cV5YP` or `2001:0db8:85a3:0000:0000:8a2e:0370:7334`?
Well with `what` all you have to do is ask via one of the three available methods and it will tell you! Simply feed `what` one or more pieces of text and it will try to identify them.

`what`s' job is to help you by identifing what something is. Not only does it have ability to identify single pieces of inputted text, but it can also read and identify the contents of a file, as well as being able to fetch data from a URL and identify the text within it.

Check out a live example at [JSFiddle](https://jsfiddle.net/p4rzL10s/).

# 🏓 Table Of Contents

- [What is what?](-#what-is-what)
- [Installation](#-installation)
- [API](#-api)
  - [Command Line](#-command-line)
  - [Node](#-node)
  - [Browser](#-browser)

# 📩 Installation

### Command Line

```bash
npm install jswhat -g
yarn add jswhat -g
pnpm add jswhat -g
```

### Node

```bash
npm install jswhat
yarn add jswhat
pnpm add jswhat
```

### Browser

```html
<script src="https://unpkg.com/jswhat@2.0.0/dist/what.js"></script>
```

# 🍕 API

## 💻 Command Line

Once installed globally, you will gain access to the `what` command. You can use `what --help` to see a basic help menu containing usage, option infromation and examples. You can also use the command `jswhat`, which is just an alias for `what`.

### Usage

`what <inputs> [options]`

### Options

```
 -h, --help                 Show help message.
 -v, --version              Show the installed version of jsWhat.
 -s, --search               Search globally within a string.
 -r, --rarity               Filter the results by rarity, one or two numbers searate by commas.
 -n, --non-text             The text input is a file path or URL.
 -f, --filter               Filter the results by names or tags, separate by commons.
 -e, --exclude              Exclude results based on names and tags, separate by commons.
 -t, --tags                 Show all the available tags.
```

### Inputs

When wanting to identify some basic text, just type `what <inputs>` and `what` will try to identify what it is, simple right?
You can identify more than one piece of text by simply feeding `what` more strings (with spaces in between), like `what <input> <input> <input>`. In fact, any argument that does not start with a dash (-) will be treated as a string to identify.

### Non-Text

You also have the ability to use `what` to read a file and fetch data from a URL. All you need to do is pass a file path or URL as the text argument and enable the `non-text` option. Examples `what ./src/data/regexes.json --non-text`, `what https://data.iana.org/TLD/tlds-alpha-by-domain.txt -n`.
The `non-text` is required to ensure you are meaning to read a file or fetch a URL, as you could be looking to identify the path to the file or URL itself instead.

## 🟢 Node

The node module is very simple to use, containing only a single method.

```js
const what = require('jswhat');
// OR
import what from 'jswhat';
```

`<what>.is(<inputs> [, options])`

- `<inputs> {string|string[]}` The text to be identified.
- `[options.nonText] {boolean}` Whether the inputs should be treated as file paths/URLs.
- `[options.search] {boolean}` Search the inputs globally.
- `[options.rarity] {number[]}` Filter the results by rarity.
- `[options.filter] {string[]}` Names or tags to filter results by.
- `[options.exclude] {string[]}` Names or tags to exclude from the results.

The above method returns an array containing objects. The format is as follows:

```js
[
    {
        "matched": String, // The content that was identified
        "name": String, // What it was identified as
        "short": String, // A short name for what it was identified as
        "description": String, // A description of what was identified
        "url": String, // A URL, sometimes linking to somewhere with more information
        "rarity": Number, // The rarity of this match, a number between 0 and 1
        "regex": RegExp, // The expression that was used to identify the matched
        "tags": Array<String>, // Array of tags for the identified
    },
    ...,
    time: Number, // The amount of time this took in milliseconds
    matched: Array<String>, // A shorthand for `<matched>.map(m => m.matched)`
    names: Array<String>, // Shorthand for `<matched>.map(m => m.name)`
    short: Array<String>, // A shorthand for `<matched>.map(m => m.short)`
    tags: Array<String>, // Shorthand for `<matched>.map(m => m.tags).flat().filter((m, i, s) => s.indexOf(m) === i)`
]
```

## 📺 Browser

`jsWhat` works in the exact same way in the browser as in Node, although without the ability to read a file.

```html
<script src="https://unpkg.com/jswhat@2.0.0/dist/what.js"></script>
```

View the [Node section](#-node) for usage and options.