<p align="center">
  <img alt="jsWhat" src=".github/logo.png"><br>
  <i>The easiest way to identify anything</i><br>
  <code>npm install jswhat --global</code>
</p>

<!--
<p align="center">
  <a href="https://github.com/apteryxxyz/jswhat/"><img alt="module version" src="https://img.shields.io/github/package-json/v/apteryxxyz/jswhat?logo=github"></a>
  <a href="https://npmjs.com/package/jswhat"><img alt="total downloads" src="https://img.shields.io/npm/dt/jswhat?logo=npm"></a>
  <a href="https://github.com/apteryxxyz/jswhat/"><img alt="javascript percentage" src="https://img.shields.io/github/languages/top/apteryxxyz/jswhat?logo=github"></a>
  <a href="https://github.com/apteryxxyz/jswhat/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/npm/l/jswhat?logo=github"></a>
</p>
-->

# 🤔 What is what?

`jsWhat` is a JavaScript version of the existing [pyWhat](https://github.com/bee-san/pyWhat). Works in NodeJS, the browser and the command line.

Have you ever come across a mysterious 🧙‍♂️ piece of text and wondered what it might be? Perhaps something like `rBxwE6ivExFJjRPh5cZtpq1ghTDm6cV5YP` or `2001:0db8:85a3:0000:0000:8a2e:0370:7334`?
Well with `what` all you have to do is ask `what rBxwE6ivExFJjRPh5cZtpq1ghTDm6cV5YP` and it will tell you!
You can even type more than one piece of text and `what` will try to identify them all (`what rBxwE6ivExFJjRPh5cZtpq1ghTDm6cV5YP 2001:0db8:85a3:0000:0000:8a2e:0370:7334`).

`what`s' job is to help you by identifing what something is. Wether it be a simple string of text, a file, or even a URL! `what` can read a file and identify text within it, fetch data from a URL and identify text within that data, or simply identify a string of text.

# 🏓 Table Of Contents

- [Installation](#📩-installation)
- [API](#🍕-api)
  - [Command Line](#💻-command-line)
  - [NodeJS](#🟢-nodejs)
  - [Browser](#📺-browser)

# 📩 Installation

Command Line/NodeJS using NPM:

```npm install jswhat --global```

Browser using jsDelivr CDN:

```<script src="https://cdn.jsdelivr.net/npm/jswhat/dist/what.min.js"></script>```


# 🍕 API

## 💻 Command Line

Once installed globally, you will have access to the `what` command. You can use `what --help` to see a basic help menu containing usage, option information and examples.

### Text

When wanting to identify some basic text, simply type `what <text>` and the module will try to identify what it is. You can also identify multiple strings by simply putting a space between the strings `what <text> <text> <text>`. Anything argument that doesn't start with a dash (-) will be considered a string to identify.

### File

You can also scan a file and identify strings within them. All you have to do is pass a file path as the text argument and enable the `nontext` option `what path/to/file --nontext`. The `nontext` is required to ensure you are meaning to scan a file, as you could be looking to identify the path itself instead.

### URL

You have the ability to also scan text from a URL. It cound be the HTML of a site like `https://www.google.com/` or the contents of  a file hosted online, like `https://data.iana.org/TLD/tlds-alpha-by-domain.txt`, example `what https://url.to/text --nontext`. This also requires the `nontext` option for the same reason as a file.

## 🟢 NodeJS

The node module is also very simply, containing onty a single method.

`<what>.is(<text>, [search], [options])`
- `<text> {string}` = Content to be identified.
- `[search] {boolean}` = Wether or not to search the content globally.
- `[options.nontext] {boolean}` = Wether or not the text should be treated as a file path or URL.
- `[options.filter] {string|string[]}` = A string or array of names or tags to filter results by.
- `[options.exclude] {string|string[]}` = A string or array of names or tags to exclude from the results.

```js
const what = require('jswhat');

const result = what.is('e@mail.com');
// Email (e@mail.com)

const search = what.is('e@mail.com', true);
// Email (e@mail.com), URL (mail.com)

const nontext = await what.is('https://data.iana.org/TLD/tlds-alpha-by-domain.txt', true, { nontext : true })
// this returns a promise
// Phone Number (2021062100), SSN (202106210), Timestamp (2021062100)

const filter = what.is(['microsoft@hotmail.com', 'google@gmail.com'], true, { filter: 'Uniform Resource Locator (URL)' });
// URL (hotmail.com), URL (gmail.com)
```

### Output

The above method will return an array of objects in the following format:

```json
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
]
```

## 📺 Browser

`jsWhat` works the same way in the browser as in NodeJS, although without the ability to read a file or fetch a URL, AKA no `nontext` option.


`what.is(<text>, [search], [options])`
- `<text> {string}` = Content to be identified.
- `[search] {boolean}` = Wether or not to search the content globally.
- `[options.filter] {string|string[]}` = A string or array of names or tags to filter results by.
- `[options.exclude] {string|string[]}` = A string or array of names or tags to exclude from the results.

```js
<script src="https://cdn.jsdelivr.net/npm/jswhat/dist/what.min.js"><script/>

<script>
  console.log(what.is('e@mail.com'));
  // Email (e@mail.com)

  console.log(what.is('e@mail.com', true));
  // Email (e@mail.com), URL (mail.com)

  console.log(what.is(['microsoft@hotmail.com', 'google@gmail.com'], true, { exclude: 'Email Address' }));
  // URL (hotmail.com), URL (gmail.com)
<script/>
```

The output for the above is the same as [NodeJS](#output).