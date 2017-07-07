/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const fs = require('fs');

const dissassembler = function(file) {
  const bufferMemory = Buffer.alloc(512);
  const mem = Buffer.concat([bufferMemory, file]);
  console.log(`Memory: ${mem.toString('hex')}`);

  let pc = 0x200;
  let run = true;

  while (run) {
    console.log(`Current PC: ${pc}`);

    const opcode = mem[pc] << 8 | mem[pc + 1];
    console.log(`Received: ${opcode}`);

    switch (opcode) {
      case 0x00E0: console.log('clear'); break;
      case 0x00EE: console.log('return'); break;
      default:
    }
    
    switch (opcode & 0xF000) {
      case 0x1000: console.log('jmp'); break;
      case 0x2000: console.log('exec'); break;
      case 0x3000: console.log('skip'); break;
      case 0x4000: console.log('skip2'); break;
      case 0x5000: console.log('skip3'); break;
      case 0x6000: console.log('store'); break;
      case 0x7000: console.log('add'); break;
      case 0x8000: console.log('8 block'); break;
      case 0x9000: console.log('skip4'); break;
      case 0xA000: console.log('store2'); break;
      case 0xB000: console.log('jmp+offset'); break;
      case 0xC000: console.log('rand'); break;
      case 0xD000: console.log('draw'); break;
      case 0xE000: console.log('E block'); break;
      case 0xF000: console.log('F block'); break;
      default: console.log('unknown');
    }

    pc += 2;
    if (pc >= mem.length) {
      run = false;
    }
  }
};

const loadFile = function(fileName) {
  return fs.readFileSync(fileName);
};

dissassembler(loadFile('../roms/GAMES/GUESS'));
