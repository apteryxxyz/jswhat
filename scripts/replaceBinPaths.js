#! /usr/bin/env node
/**
 * @fileoverview This script is used to update the path to the main index.js within the what.js file.
 */

console.info('Updating paths within bin file...');

const fs = require('fs');
const path = require('path');

const binPath = path.join(__dirname, '..', 'dist', 'what.js');
const binContent = fs.readFileSync(binPath, 'utf8');

const newContent = binContent.replaceAll('../src', '.');
fs.writeFileSync(binPath, newContent);

console.info('Updated bin paths');
