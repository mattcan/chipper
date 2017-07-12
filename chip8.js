/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/

const main = require('./src/main');
const disassembler = require('./src/chip8-disassembly');
const fs = require('fs');

const FILE_PATH_POSITION = 3;

if (process.argv.length !== 4) {
  console.log('How to use: node chip8.js <command> <path to rom>');
  process.exit(1);
}


let fileData = [];
try {
  fileData = fs.readFileSync(process.argv[FILE_PATH_POSITION]);
} catch(e) {
  console.log('Invalid file or path', e);
  process.exit(2);
}

switch (process.argv[2]) {
  case 'vm': main(fileData); break;
  case 'ds':
  case 'disassemble': disassembler(fileData); break;
  default: console.log('fudge'); break;
}
