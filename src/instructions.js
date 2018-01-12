/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/

module.exports = {
  initialize: function (cpu, memory, screenBuffer, getCurrentKeyPressed) {
    this._cpu = cpu;
    this._memory = memory;
    this._screenBuffer = screenBuffer;
    this._getCurrentKey = getCurrentKeyPressed;
  },

  missing: function () {
    console.log('Need to implement instruction');
    return this._cpu.pc.next();
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

  draw: function (x, y, nibble) {

    const getSprite = (baseAddress, startByte, mem) => {
      const sprite = [];

      for (i = 0; i < startByte; i++) {
        sprite[i] = [];
        spr = mem[baseAddress + i];
        for (j = 0; j < 8; j++) {
          if ((spr & 0x80) > 0) {
            sprite[i][j] = spr;
          }
          spr <<= 1;
        }
      }

      return sprite;
    };

    const coords = {
      x: this._cpu.register.get(x),
      y: this._cpu.register.get(y)
    };

    const hasCollision = this._screenBuffer.drawSprite(
      coords,
      getSprite(this._cpu.register.getI(), nibble, this._memory));

    if (hasCollision) {
      this._cpu.register.set(0xF, 1);
    } else {
      this._cpu.register.set(0xF, 0);
    }

    return this._cpu.pc.next();
  },

  copyRegister: function (to, from) {
    const fromValue = this._cpu.register.get(from);

    this._cpu.register.set(to, fromValue);

    return this._cpu.pc.next();
  },

  bitAnd: function (regOne, regTwo) {
    const regOneVal = this._cpu.register.get(regOne);
    const regTwoVal = this._cpu.register.get(regTwo);

    const newVal = regOneVal & regTwoVal;

    this._cpu.register.set(regOne, newVal);

    return this._cpu.pc.next();
  },

  addRegisters: function (regOne, regTwo) {
    const regOneVal = this._cpu.register.get(regOne);
    const regTwoVal = this._cpu.register.get(regTwo);

    const newVal = regOneVal + regTwoVal;
    this._cpu.register.set(regOne, (newVal & 0xFF));

    this._cpu.register.set(
      0xF,
      (newVal > 255 ? 1 : 0)
    );

    return this._cpu.pc.next();
  },

  subtractRegister: function (fromReg, subtractorReg) {
    const regOneVal = this._cpu.register.get(fromReg);
    const regTwoVal = this._cpu.register.get(subtractorReg);

    const newVal = regOneVal - regTwoVal;
    this._cpu.register.set(regOneVal, newVal);

    this._cpu.register.set(
      0xF,
      (regOneVal > regTwoVal ? 1 : 0)
    );

    return this._cpu.pc.next();
  },

  setRegisterI: function (addr) {
    this._cpu.register.setI(addr);

    return this._cpu.pc.next();
  },

  saveRandom: function (regNumber, byte) {
    const random = Math.floor(Math.random() * 255);
    const newValue = random & byte;

    this._cpu.register.set(regNumber, newValue);

    return this._cpu.pc.next();
  },

  skipNextInstruction: function (regNumber) {
  /*
    ExA1 - SKNP Vx
    Skip next instruction if key with the value of Vx is not pressed.

    Checks the keyboard, and if the key corresponding to the value of Vx is currently in the up position, PC is increased by 2.
   */
  },

  copyDelyToRegister: function (regNumber) {
    /*
      Fx07 - LD Vx, DT
      Set Vx = delay timer value.

      The value of DT is placed into Vx.
    */
  }

};
