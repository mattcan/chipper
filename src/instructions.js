/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/

module.exports = {
  initialize: function (cpu, memory) {
    this._cpu = cpu;
    this._memory = memory;
  },

  jp: function (address) {
    return this._cpu.pc.set(address);
  },

  call: function (address) {
    this._memory.stack.push(this._cpu.pc.get());
    return this._cpu.pc.set(address);
  },

};