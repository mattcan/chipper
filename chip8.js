/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
// TODO import main routine
const disassembler = require('./src/chip8-disassembly');
const fs = require('fs');
const FILE_PATH_POSITION = 2;


if (process.argv.length !== 3) {
  console.log('How to use: npm start <path to rom>');
  process.exit(1);
}


let fileData = [];
try {
  fileData = fs.readFileSync(process.argv[FILE_PATH_POSITION]);
} catch(e) {
  console.log('Invalid file or path', e);
  process.exit(2);
}

// TODO call main function
disassembler(fileData);
