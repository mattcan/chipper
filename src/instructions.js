/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/

module.exports = {
  initialize: function (cpu, memory, screenBuffer) {
    this._cpu = cpu;
    this._memory = memory;
    this._screenBuffer = screenBuffer;
  },

  clearScreen: function () {
    this._screenBuffer.reset();
    return this._cpu.pc.next();
  },

  ret: function () {
    const returnTo = this._memory.stack.pop();
    return this._cpu.pc.set(returnTo);
  },

  jp: function (address) {
    return this._cpu.pc.set(address);
  },

  call: function (address) {
    this._memory.stack.push(this._cpu.pc.get());
    return this._cpu.pc.set(address);
  },

  skipIfValueEqual: function (regNumber, value) {
    const regValue = this._cpu.register.get(regNumber);

    if (regValue === value) {
      this._cpu.pc.next();
    }

    return this._cpu.pc.next();
  },

  skipIfValueNotEqual: function (regNumber, value) {
    const regValue = this._cpu.register.get(regNumber);

    if (regValue !== value) {
      this._cpu.pc.next();
    }

    return this._cpu.pc.next();
  },

  skipIfRegistersEqual: function (regOne, regTwo) {
    const regOneValue = this._cpu.register.get(regOne);
    const regTwoValue = this._cpu.register.get(regTwo);

    if (regOneValue === regTwoValue) {
      this._cpu.pc.next();
    }

    return this._cpu.pc.next();
  },

  insertValueIntoRegister: function (regNumber, value) {
    this._cpu.register.set(regNumber, value);
    return this._cpu.pc.next();
  },

  addValueToRegister: function (regNumber, value) {
    const regValue = this._cpu.register.get(regNumber);
    const newValue = regValue + value;

    this._cpu.register.set(regNumber, newValue);

    return this._cpu.pc.next();
  },

  draw: (x, y, nibble) => {
    const getSprite = (nibble) => {};

    const hasCollision = this._screenBuffer.drawSprite({x, y}, getSprite(nibble));

    if (hasCollision) {
      this._cpu.register.set(0xF, 1);
    } else {
      this._cpu.register.set(0xF, 0);
    }

    return this._cpu.pc.next();
  }

};
