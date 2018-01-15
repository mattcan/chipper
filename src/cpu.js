/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const OutOfBounds = require('./exceptions/OutOfBounds');
const instructions = require('./instructions');
// const memory = require('./memory');
// const screenBuffer = require('./screen').screenBuffer();

const PROGRAM_START = 0x200;
const CLOCK_SPEED = 60; // Hz

module.exports = {

  // Create all the private variables
  initialize: function () {
    this.register._vReg = Buffer.alloc(16);
    this._iReg = Buffer.alloc(2);
    this._sound = Buffer.alloc(1);
    this._halt = Buffer.alloc(1);
    this.pc._pointer = PROGRAM_START;
    this._tickHandler = undefined;
    this._instructions = instructions.initialize(this);
  },

  run: function () {
    this.initialize();

    const self = this;

    const tick = function () {
      return setInterval(function () {
        self.execute(self.decode);
        // repaint?
      }, 1000 / CLOCK_SPEED);
    };

    this._tickHandler = tick();
  },

  decode: function () {
    const pc = this.pc.get();
    // get opcode
    // get get arguments
    // return data in structure
  },

  execute: function (operation) {
    // jump table for instructions
  },

  getMemory: function () {
    return undefined;
  },

  getScreenBuffer: function () {
    return undefined;
  },

  register: {
    get: function (index) {
      if (index >= this._vReg.length || index < 0) {
        throw new OutOfBounds('Register only has 16 spaces');
      }

      return this._vReg[index];
    },

    set: function (index, value) {
      if (index >= this._vReg.length || index < 0) {
        throw new OutOfBounds('Cannot set undefined register');
      }

      this._vReg[index] = value;
    },

    getI: () => ( this._iReg ),

    setI: (val) => { this._iReg = val; }
  },

  pc: {
    _pointer: null,

    get: function () {
      return this._pointer;
    },

    set: function (address) {
      this._pointer = address;
      return this._pointer;
    },

    next: function () {
      return this.set(this._pointer + 2);
    }
  }
};
