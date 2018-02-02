/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const instructions = require('../src/instructions');

jest.mock('../src/cpu', () => ({
  register: {
    get: jest.fn(),
    set: jest.fn()
  },
  pc: {
    _pointer: 0x0,
    set: jest.fn(),
    get: jest.fn(),
    next: jest.fn()
  },
  getMemory: jest.fn(),
  getLogger: jest.fn(() => ({ log: jest.fn() }))
}));

describe('Instructions', () => {
  let cpu;

  beforeEach(() => {
    jest.resetModules();

    cpu = require('../src/cpu');
  })

  it('JP moves program counter to a new address', () => {
    const jumpToAddress = 0x352;

    cpu.pc.set.mockReturnValueOnce(0x352);
    instructions.initialize(cpu);

    const newPC = instructions.jp(jumpToAddress);
    expect(newPC).toBe(0x352);
    expect(cpu.pc.set).toHaveBeenCalledWith(0x352);
  });

  it('CALL executes subroutine at address', () => {
    cpu.pc.set.mockReturnValueOnce(0x352);
    const pushMock = cpu.getMemory.mockReturnValueOnce({ stack: { push: jest.fn() }});

    instructions.initialize(cpu);

    const newPC = instructions.call(0x352);
    expect(newPC).toBe(0x352);
    expect(pushMock).toHaveBeenCalled();
  });

  describe('Skip if register equals value', () => {

    beforeEach(() => {
      cpu.pc._pointer = 0x200;
      cpu.register.get.mockReturnValueOnce(0xFA);

      instructions.initialize(cpu);
    });

    it('SE Vx, byte increments counter', () => {
      instructions.skipIfValueEqual(0, 0xFA);
      expect(cpu.register.get).toHaveBeenCalled();
      expect(cpu.pc.next).toHaveBeenCalledTimes(2);
    });

    it('SE Vx, byte does nothing', () => {
      instructions.skipIfValueEqual(0, 0xAA);
      expect(cpu.pc.next).toHaveBeenCalledTimes(1);
    });

  });

  describe('Skip if register x does not equal value', () => {

    beforeEach(() => {
      cpu.register.get.mockReturnValueOnce(0xFA);
      cpu.pc._pointer = 0x200;

      instructions.initialize(cpu);
    });

    it('SNE Vx, byte skips next instruction', () => {
      instructions.skipIfValueNotEqual(0, 0xAA);
      expect(cpu.pc.next).toHaveBeenCalledTimes(2);
    });

    it('SNE Vx, byte continues to next instruction', () => {
      instructions.skipIfValueNotEqual(0, 0xFA);
      expect(cpu.pc.next).toHaveBeenCalledTimes(1);
    });

  });

  describe('Skip if registers are equal', () => {

    it('Skips next instruction', () => {
      cpu.register.get
        .mockReturnValue(0xFA)
        .mockReturnValueOnce(0xFA);
      cpu.pc._pointer = 0x200;

      instructions.initialize(cpu);

      instructions.skipIfRegistersEqual(0, 1);
      expect(cpu.pc.next).toHaveBeenCalledTimes(2);
    });

    it('Continues to next instruction', () => {
      cpu.register.get
        .mockReturnValue(0xFA)
        .mockReturnValueOnce(0xBD);
      cpu.pc._pointer = 0x200;

      instructions.initialize(cpu);

      instructions.skipIfRegistersEqual(0, 1);
      expect(cpu.pc.next).toHaveBeenCalledTimes(1);
    });

  });

  it('Insert value into register', () => {
    cpu.pc._pointer = 0x200;
    instructions.initialize(cpu);

    instructions.insertValueIntoRegister(0, 0xA1);
    expect(cpu.pc.next).toHaveBeenCalledTimes(1);
    expect(cpu.register.set).toHaveBeenCalledTimes(1);
  });

  describe('Register work', () => {
    let regOne, regTwo;

    beforeEach(() => {
      cpu.register.get = jest.fn((registerIndex) => { return 0x01; });
      instructions.initialize(cpu);
      regOne = 0;
      regTwo = 1;
    });

    it('Adds value to register', () => {
      instructions.addValueToRegister(0, 0x01);
      expect(cpu.pc.next).toHaveBeenCalledTimes(1);
      expect(cpu.register.set).toHaveBeenCalledWith(0, 0x02);
    });

    it('Copies a registers value to another register', () => {
      const fromReg = 0;
      const toReg = 1;
      instructions.copyRegister(toReg, fromReg);

      expect(cpu.pc.next).toHaveBeenCalledTimes(1);
      expect(cpu.register.get).toHaveBeenCalledTimes(1);
      expect(cpu.register.set).toHaveBeenCalledWith(toReg, 0x01);
    });

    it('Performs a bitwise AND on two register values and saves the result in first reg', () => {
      cpu.register.get
        .mockReturnValueOnce(0x01);
      instructions.bitAnd(regOne, regTwo);

      expect(cpu.register.get).toHaveBeenCalledTimes(2);
      expect(cpu.register.set).toHaveBeenCalledWith(regOne, 0x01);
    });

    it('Add two registers, save in X, carry set to zero', () => {
      cpu.register.get
        .mockReturnValueOnce(0x02);
      instructions.addRegisters(regOne, regTwo);

      expect(cpu.pc.next).toHaveBeenCalledTimes(1);
      expect(cpu.register.get).toHaveBeenCalledTimes(2);
      expect(cpu.register.set).toHaveBeenCalledWith(regOne, 0x03);
      expect(cpu.register.set).toHaveBeenCalledWith(0xF, 0x0);
    });

    it('Add two registers, save in X, carry set to one', () => {
      cpu.register.get
        .mockReturnValueOnce(0xFF);
      instructions.addRegisters(regOne, regTwo);

      expect(cpu.pc.next).toHaveBeenCalledTimes(1);
      expect(cpu.register.get).toHaveBeenCalledTimes(2);
      expect(cpu.register.set).toHaveBeenCalledWith(regOne, 0x0);
      expect(cpu.register.set).toHaveBeenLastCalledWith(0xF, 0x1);
    });

    it('Subtract register two from one, set borrow to one', () => {
      cpu.register.get
        .mockReturnValue(0xFF);
      instructions.subtractRegister(regTwo, regOne);

      expect(cpu.pc.next).toHaveBeenCalledTimes(1);
      expect(cpu.register.get).toHaveBeenCalledTimes(2);
      expect(cpu.register.set).toHaveBeenCalledWith(regTwo, 0x0);
      expect(cpu.register.set).toHaveBeenLastCalledWith(0xF, 0x0);
    });
  });

});
