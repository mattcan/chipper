/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const OutOfBounds = require('./exceptions/OutOfBounds');

const PROGRAM_START = 0x200;

module.exports = {

  // Create all the private variables
  initialize: function () {
    this.register._vReg = Buffer.alloc(16);
    this._flag = false;
    this._iReg = Buffer.alloc(2);
    this._sound = Buffer.alloc(1);
    this._halt = Buffer.alloc(1);
    this.pc._pointer = PROGRAM_START;
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
    }
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
