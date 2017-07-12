/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/

const MAX_MEMORY_SIZE = 4096;
const PROGRAM_OFFSET = 0x200;
const STACK_POINTER_START = 0x1DE;
const STACK_POINTER_END = 0x1FE;

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

const memory = {
  _buf: [],

  _loadToMemory:  function(data, offset = 0) {
    for (let i = 0; i < data.length; i += 1) {
      if (i >= this._buf.length) {
        throw new Error('Data longer than available memory');
      }

      this._buf[i + offset] = data[i];
    }
  },

  initialize: function () {
    this._buf = Buffer.alloc(MAX_MEMORY_SIZE);
    this._loadToMemory(FONT_SPRITES);
    this.stack.memParent = this;
    this.stack.pointer = STACK_POINTER_START;
  },

  setByte: function (value, offset) {
    this._buf[offset] = value;
  },

  loadProgram: function (program) {
    this._loadToMemory(program, PROGRAM_OFFSET);
  },

  getAt: function (loc) {
    return this._buf[loc];
  },

  size: function () {
    return this._buf.length;
  },

  stack: {
    memParent: null,
    pointer: 0x0,

    push: function (value) {
      if (this.pointer >= STACK_POINTER_END) {
        throw Error('Stack is full');
      }

      const firstByte = (value & 0xFF00) >> 4;
      const secondByte = value & 0x00FF;

      this.memParent.setByte(firstByte, this.pointer);
      this.memParent.setByte(secondByte, this.pointer + 1);

      this.pointer += 2;
    },

    pop: function () {
      this.pointer -= 2;

      const firstByte = this.memParent.getAt(this.pointer) << 4;
      const secondByte = this.memParent.getAt(this.pointer + 1);

      return firstByte | secondByte;
    }

  }
};

module.exports = memory;
