/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const cpu = require('../src/cpu');
const OutOfBounds = require('../src/exceptions/OutOfBounds');

jest.mock('../src/memory', () => ({
  initialize: jest.fn(),
  loadProgram: jest.fn()
}));

describe('CPU', () => {
  let memory;

  beforeEach(() => {
    jest.resetModules();
    memory = require('../src/memory');

    cpu.initialize();
  })

  it('will initialize registers', () => {
    expect(cpu.register._vReg.length).toBe(16);
    expect(cpu._iReg.length).toBe(2);
    expect(cpu._sound.length).toBe(1);
    expect(cpu._halt.length).toBe(1);
  });

  describe('Registers', () => {

    it('will get register zero', () => {
      expect(cpu.register.get(0)).toBe(0x00);
    });

    it('will throw an error when out of bounds', () => {
      expect(cpu.register.get(0xF)).toBe(0x00);
      expect(function () {
        cpu.register.get(0x10);
      }).toThrowError(OutOfBounds);
    });

    it('will set register zero to 0x01', () => {
      cpu.register.set(0, 0x01);
      expect(cpu.register._vReg[0]).toBe(0x01);
    });

    it('will throw an error when setting register 17 (non-existant)', () => {
      expect(function () {
        cpu.register.set(0x10, 0xF1);
      }).toThrowError(OutOfBounds);
    });

  });

  describe('Program Counter', () => {

    it('will return current PC', () => {
      expect(cpu.pc.get()).toBe(0x200);
    });

    it('will set the PC to 0x300', () => {
      expect(cpu.pc._pointer).toBe(0x200);

      cpu.pc.set(0x300);
      expect(cpu.pc._pointer).toBe(0x300);
    });

    it('will continue to the next address', () => {
      expect(cpu.pc._pointer).toBe(0x200);

      const nextAddress = cpu.pc.next();
      expect(nextAddress).toBe(0x202);
      expect(cpu.pc._pointer).toBe(0x202);
    });

  });

});
