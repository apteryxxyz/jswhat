<p align="center">
  <img alt="jsWhat" src=".github/logo.png"><br>
  <i>The easiest way to identify anything</i><br>
  <code>npm install jswhat --global</code>
</p>

<p align="center">
  <a href="https://github.com/apteryxxyz/jswhat/"><img alt="module version" src="https://img.shields.io/github/package-json/v/apteryxxyz/jswhat"></a>
  <a href="https://npmjs.com/package/jswhat"><img alt="node support versions" src="https://img.shields.io/node/v/jswhat"></a>
  <a href="https://npmjs.com/package/jswhat"><img alt="total downloads" src="https://img.shields.io/npm/dt/jswhat"></a>
  <br>
  <a href="https://github.com/apteryxxyz/jswhat/"><img alt="javascript percentage" src="https://img.shields.io/github/languages/top/apteryxxyz/jswhat"></a>
  <a href="https://bundlephobia.com/package/jswhat"><img alt="jswhat code size" src="https://img.shields.io/bundlephobia/minzip/jswhat"></a>
  <a href="https://github.com/apteryxxyz/jswhat/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/npm/l/jswhat"></a>
  <br>
  <a href="https://github.com/apteryxxyz"><img alt="apteryxxyz followers" src="https://img.shields.io/github/followers/apteryxxyz?style=social"></a>
  <a href="https://github.com/apteryxxyz/jswhat"><img alt="jswhat repo stars" src="https://img.shields.io/github/stars/apteryxxyz/jswhat?style=social"></a>
</p>

# 🤔 What is what?

`jsWhat` is a JavaScript version of the existing [pyWhat](https://github.com/bee-san/pyWhat). Works in NodeJS, the browser and the command line.

Have you ever come across a mysterious 🧙‍♂️ piece of text and wondered what it might be? Perhaps something like `rBxwE6ivExFJjRPh5cZtpq1ghTDm6cV5YP` or `2001:0db8:85a3:0000:0000:8a2e:0370:7334`?
Well with `what` all you have to do is ask via one of the three available methods and it will tell you! Simply feed `what` one or more pieces of text and it will try to identify them.

`what`s' job is to help you by identifing what something is. Not only does it have ability to identify single pieces of inputted text, but it can also read and identify the contents of a file, as well as being able to fetch data from a URL and identify the text within it.

# 🏓 Table Of Contents

- [What is what?](-#what-is-what)
- [Installation](#-installation)
- [Documentation](#-documentation)
  - [Command Line](#-command-line)
  - [NodeJS](#-nodejs)
  - [Browser](#-browser)

# 📩 Installation

Command Line/NodeJS using NPM:

```npm install jswhat --global```

Browser using unpkg CDN:

```<script src="https://unpkg.com/jswhat/dist/what.min.js"></script>```

# 🍕 Documentation

## 💻 Command Line

Once installed globally, you will gain access to the `what` command. You can use `what --help` to see a basic help menu containing usage, option infromation and examples. You can also use the command `jswhat`, which is just an alias for `what`.

### Usage
`what <text> [options]`

### Options

```
 -h, --help                Show help message.
 -v, --version             Show the installed version of jsWhat.
 -s, --search              Search globally within a string.
 -n, --nontext             The text input is a file path or URL.
 -t, --tags                Show all the available tags.
 -f, --filter              Filter the results by names or tags, separate by commons.
 -e, --exclude             Exclude results based on names and tags, separate by commons.
```

### Text

When wanting to identify some basic text, just type `what <text>` and `what` will try to identify what it is, simple right?
You can identify more than one piece of text by simply feeding `what` more strings (with spaces in between), like `what <text> <text> <text>`. In fact, any argument that does not start with a dash (-) will be treated as a string to identify.

### Nontext

You also have the ability to use `what` to read a file and fetch data from a URL. All you need to do is pass a file path or URL as the text argument and enable the `nontext` option. Examples `what ./src/data/regexes.json --nontext`, `what https://data.iana.org/TLD/tlds-alpha-by-domain.txt -n`.
The `nontext` is required to ensure you are meaning to read a file or fetch a URL, as you could be looking to identify the path to the file or URL itself instead.

## 🟢 Node

[Node Examples](./examples/node.js)

The node module is very simply to use, containing only a single method.

`<what>.is(<text>, [search], [options])`
- `<text> {string}` = Content to be identified.
- `[search] {boolean}` = Wether or not to search the content globally.
- `[options.nontext] {boolean}` = Wether or not the text should be treated as a file path or URL.
- `[options.filter] {string|string[]}` = A string or array of names or tags to filter results by.
- `[options.exclude] {string|string[]}` = A string or array of names or tags to exclude from the results.

The above method returns an array containing objects. Format is as follows:

```js
[
  {
    "matched": String, // the content that was identified
    "name": String, // what it was identified as
    "description": String, // a description of what was identified
    "url": String, // a URL, sometimes linking to somewhere with more information
    "regex": RegExp, // the regex that was used to identify the text
    "tags": String[] // array of tags for the identified
  },
  ...
  text: String[], // the strings passed into the method
  error: Error, // if the method produces an error, it will appear in this property
  names: String[], // shortname for <matched>.map(m => m.name)
  matched: String[], // shortname for <matched>.map(m => m.matched)
  tags: String[] // shortname for <matched>.map(m => m.tags).flat().filter((m, i, s) => s.indexOf(m) === i)
]
```

## 📺 Browser

[Browser Examples](./examples/browser.html)

`jsWhat` works in almost the exact same way in the browser as in NodeJS, although without the ability to read a file or fetch data from a URL, AKA no `nontext` option.

`<what>.is(<text>, [search], [options])`
- `<text> {string}` = Content to be identified.
- `[search] {boolean}` = Wether or not to search the content globally.
- `[options.filter] {string|string[]}` = A string or array of names or tags to filter results by.
- `[options.exclude] {string|string[]}` = A string or array of names or tags to exclude from the results.

The above method returns an array containing objects. Format is as follows:

```js
[
  {
    "matched": String, // the content that was identified
    "name": String, // what it was identified as
    "description": String, // a description of what was identified
    "url": String, // a URL, sometimes linking to somewhere with more information
    "regex": RegExp, // the regex that was used to identify the text
    "tags": String[] // array of tags for the identified
  },
  ...
  text: String[], // the strings passed into the method
  error: Error, // if the method produces an error, it will appear in this property
]
```