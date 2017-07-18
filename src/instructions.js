/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/

module.exports = {
  initialize: function (cpu) {
    this._cpu = cpu;
  },

  jp: function (address) {
    return this._cpu.pc.set(address);
  }
};
