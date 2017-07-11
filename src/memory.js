/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/

const MAX_MEMORY_SIZE = 4096;
const PROGRAM_OFFSET = 512;

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

const memory = {
  buf: [],

  initialize: function () {
    this.buf = Buffer.alloc(MAX_MEMORY_SIZE);
    this.buf = loadToMemory(this.buf, FONT_SPRITES);
  },

  loadProgram: function (program) {
    this.buf = loadToMemory(this.buf, program, PROGRAM_OFFSET);
  },

  getAt: function (loc) {
    return this.buf[loc];
  },

  size: function () {
    return this.buf.length;
  }
};

module.exports = memory;
