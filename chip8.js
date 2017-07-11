/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/

const main = require('./src/main');
const fs = require('fs');

const FILE_PATH_POSITION = 2;

if (process.argv.length !== 3) {
  console.log('How to use: node chip8.js <path to rom>');
  process.exit(1);
}


let fileData = [];
try {
  fileData = fs.readFileSync(process.argv[FILE_PATH_POSITION]);
} catch(e) {
  console.log('Invalid file or path', e);
  process.exit(2);
}

main(fileData);
