<p align="center">
  <img alt="jswhat" src=".github/logo.png"><br>
  <img alt="changelog" src=".github/changeLog.png">
</p>

## 1.0.0

#### 2021/07/07

- Rewrote to use only one codebase.
- Added support for Deno.
- Now supports node versions 0.12.0 and above.
- Added short names to regexes.
- Added categories to regexes.
- Added more options:
  - promise
  - throwError

## 0.0.7

#### 2021/06/24

- Automatically add http:// to matched URLs without them.
- Changed 'Matched' class name to 'Matches'.

## 0.0.6

#### 2021/06/23

- Added 'matched' property to Matched class.
- Changed US SSN regex to support older versions of node.
- Fixed try catch throwing error on older versions of node.
- Fixed Matched class property 'error' not having a value.

## 0.0.5

#### 2021/06/23

- Added more tests to regexes.
- NPM now ignores the 'src/data/regex' directory.
- Updated README with new browser example.

## 0.0.4

#### 2021/06/23

- Fixed Array#concat TypeError: CreateListFromArrayLike.
- Added browser test (test/dist.test.js).
- Updated README with more information.

## 0.0.2

#### 2021/06/23

- Changed from using Array#flat to Array#concat.
- Fixed Matched properties 'names' & 'tags' returning undefined.

## 0.0.1

#### 2021/06/23

- Initial "alpha" release, still testing.
