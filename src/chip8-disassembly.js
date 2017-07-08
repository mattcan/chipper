/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const fs = require('fs');

const FONT_SPRITES = [
  0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
  0x20, 0x60, 0x20, 0x20, 0x70, // 1
  0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
  0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
  0x90, 0x90, 0xF0, 0x10, 0x10, // 4
  0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
  0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
  0xF0, 0x10, 0x20, 0x40, 0x40, // 7
  0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
  0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
  0xF0, 0x90, 0xF0, 0x90, 0x90, // A
  0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
  0xF0, 0x80, 0x80, 0x80, 0xF0, // C
  0xE0, 0x80, 0x80, 0x80, 0xE0, // D
  0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
  0xF0, 0x80, 0xF0, 0x80, 0x80  // F
];

const loadToMemory = function(memory, data, offset = 0) {
  const modifiedMemory = memory;
  for (let i = 0; i < data.length; i += 1) {
    if (i >= memory.length) {
      throw new Error('Data longer than available memory');
    }

    modifiedMemory[i + offset] = data[i];
  }

  return modifiedMemory;
};

const dissassembler = function(file) {
  let bufferMemory = Buffer.alloc(4096);
  bufferMemory = loadToMemory(bufferMemory, FONT_SPRITES);
  bufferMemory = loadToMemory(bufferMemory, file, 512);
  console.log(`Memory: ${bufferMemory.toString('hex')}`);

  let pc = 0x200;
  let run = true;

  while (run) {
    console.log(`Current PC: ${pc}`);

    const opcode = bufferMemory[pc] << 8 | bufferMemory[pc + 1];
    console.log(`Received: 0x${opcode.toString(16).toUpperCase()}`);

    if ((opcode & 0xFFFF) === 0x0000) { run = false; }

    switch (opcode & 0xF000) {
      case 0x0000:
        switch (opcode) {
          case 0x00E0: console.log('CLS'); break;
          case 0x00EE: console.log('RET'); break;
          default: console.log('SYS');
        }
        break;

      case 0x1000: console.log('JP addr'); break;
      case 0x2000: console.log('CALL addr'); break;
      case 0x3000: console.log('SE Vx, byte'); break;
      case 0x4000: console.log('SNE Vx, byte'); break;
      case 0x5000: console.log('SE Vx, Vy'); break;
      case 0x6000: console.log('LD Vx, byte'); break;
      case 0x7000: console.log('ADD Vx, byte'); break;

      case 0x8000:
        switch (opcode & 0x000F) {
          case 0x0000: console.log('LD Vx, Vy'); break;
          case 0x0001: console.log('OR Vx, Vy'); break;
          case 0x0002: console.log('AND Vx, Vy'); break;
          case 0x0003: console.log('XOR Vx, Vy'); break;
          case 0x0004: console.log('ADD Vx, Vy'); break;
          case 0x0005: console.log('SUB Vx, Vy'); break;
          case 0x0006: console.log('SHR Vx {, Vy}'); break;
          case 0x0007: console.log('SUBN Vx, Vy'); break;
          case 0x000E: console.log('SHL Vx {, Vy}'); break;
        }
        break;

      case 0x9000: console.log('SNE Vx, Vy'); break;
      case 0xA000: console.log('LD I, addr'); break;
      case 0xB000: console.log('JP V0, addr'); break;
      case 0xC000: console.log('RND Vx, byte'); break;
      case 0xD000: console.log('DRW Vx, Vy, nibble'); break;

      case 0xE000:
        switch (opcode & 0x00FF) {
          case 0x009E: console.log('SKP Vx'); break;
          case 0x00A1: console.log('SKNP Vx'); break;
        }
        break;

      case 0xF000:
        switch (opcode & 0x00FF) {
          case 0x0007: console.log('LD Vx, DT'); break;
          case 0x000A: console.log('LD Vx, K'); break;
          case 0x0015: console.log('LD DT, Vx'); break;
          case 0x0018: console.log('LD ST, Vx'); break;
          case 0x001E: console.log('ADD I, Vx'); break;
          case 0x0029: console.log('LD F, Vx'); break;
          case 0x0033: console.log('LD B, Vx'); break;
          case 0x0055: console.log('LD [I], Vx'); break;
          case 0x0065: console.log('LD Vx, [I]'); break;
        }
        break;
      default: console.log('unknown');
    }

    console.log('---');

    pc += 2;
    if (pc >= bufferMemory.length) {
      run = false;
    }
  }
};

const loadFile = function(fileName) {
  return fs.readFileSync(fileName);
};

dissassembler(loadFile('../roms/GAMES/PONG'));
