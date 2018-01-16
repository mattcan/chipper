/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const sinon = require('sinon');
const memory = require('../src/memory');
const instructions = require('../src/instructions');

jest.mock('../src/cpu', () => ({
  pc: {
    set: jest.fn()
  }
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

  xit('CALL executes subroutine at address', () => {
    cpu.pc.set.mockReturnValueOnce(0x352);
    const cpuMock = sinon.mock(cpu);
    cpuMock.expects("getMemory").once().returns({ stack: { push: function () {} }});

    instructions.initialize(cpu);

    const newPC = instructions.call(0x352);
    expect(newPC).toBe(0x352);

    cpuMock.verify();
  });

  describe('Skip if register equals value', () => {

    let regMock = null;

    beforeEach(() => {
      regMock = sinon.mock(cpu.register);
      regMock.expects("get").once().withExactArgs(0).returns(0xFA);
      cpu.pc._pointer = 0x200;

      instructions.initialize(cpu);
    });

    afterEach(() => {
      regMock.verify();
      regMock.restore();
    });

    xit('SE Vx, byte increments counter', () => {
      const newPC = instructions.skipIfValueEqual(0, 0xFA);
      expect(newPC).toBe(0x204);
    });

    xit('SE Vx, byte does nothing', () => {
      const newPC = instructions.skipIfValueEqual(0, 0xAA);
      expect(newPC).toBe(0x202);
    });

  });

  describe('Skip if register x does not equal value', () => {

    let regMock = null;

    beforeEach(() => {
      regMock = sinon.mock(cpu.register);
      regMock.expects("get").once().withExactArgs(0).returns(0xFA);
      cpu.pc._pointer = 0x200;

      instructions.initialize(cpu, null);
    });

    afterEach(() => {
      regMock.verify();
      regMock.restore();
    });

    xit('SNE Vx, byte skips next instruction', () => {
      const newPC = instructions.skipIfValueNotEqual(0, 0xAA);
      expect(newPC).toBe(0x204);
    });

    xit('SNE Vx, byte continues to next instruction', () => {
      const newPC = instructions.skipIfValueNotEqual(0, 0xFA);
      expect(newPC).toBe(0x202);
    });

  });

  describe('Skip if registers are equal', () => {

    xit('Skips next instruction', () => {
      const regMock = sinon.mock(cpu.register);
      regMock.expects("get").atMost(2).returns(0xFA);
      cpu.pc._pointer = 0x200;

      instructions.initialize(cpu, null);

      const newPC = instructions.skipIfRegistersEqual(0, 1);
      expect(newPC).toBe(0x204);

      regMock.verify();
      regMock.restore();
    });

    xit('Continues to next instruction', () => {
      const regStub = sinon.stub(cpu.register, "get");
      regStub
        .onFirstCall().returns(0xFA)
        .onSecondCall().returns(0xAA);
      cpu.pc._pointer = 0x200;

      instructions.initialize(cpu, null);

      const newPC = instructions.skipIfRegistersEqual(0, 1);
      expect(newPC).toBe(0x202);
      expect(regStub.calledTwice).toBe(true);

      regStub.reset();
    });

  });

  xit('Insert value into register', () => {
    cpu.pc._pointer = 0x200;
    instructions.initialize(cpu);

    const newPC = instructions.insertValueIntoRegister(0, 0xA1);
    expect(newPC).toBe(0x202);
    expect(cpu.register._vReg[0]).toBe(0xA1);
  });

  describe('Register work', () => {
    let mockCPU, regSet, regGet;

    beforeEach(() => {
      mockCPU = { register: {}, pc: {} };
      mockCPU.register.get = (registerIndex) => { return 0x01; };
      mockCPU.register.set = () => {};
      mockCPU.pc.next = () => { return 0x202; };

      regSet = sinon.stub(mockCPU.register, "set");
      regGet = sinon.stub(mockCPU.register, "get");
    });

    xit('Adds value to register', () => {
      instructions.initialize(mockCPU, null);

      const newPC = instructions.addValueToRegister(0, 0x01);
      expect(newPC).toBe(0x202);
      expect(regSet.calledOnce).toBe(true);

      regSet.reset();
    });

    xit('Copies a registers value to another register', () => {
      instructions.initialize(mockCPU, null);

      const newPC = instructions.copyRegister(0, 1);
      expect(regSet.calledOnce).toBe(true);
      expect(regGet.callCount).toBe(1);
    });

    xit('Performs a bitwise AND on two register values and saves the result in first reg', () => {
      instructions.initialize(mockCPU, null);

      const newPC = instructions.bitAnd(0, 1);
      expect(regSet.calledOnce).toBe(true);
      expect(regGet.callCount).toBe(2);
    });

    xit('Add two registers, save in X, carry set', () => {
      instructions.initialize(mockCPU, null);

      const newPC = instructions.addRegisters(0, 1);
      expect(regSet.callCount).toBe(2);
      expect(regGet.callCount).toBe(2);
    });

    xit('Subtract register y from x, set borrow', () => {
      instructions.initialize(mockCPU, null);

      const newPC = instructions.subtractRegister(0, 1);
      expect(regSet.callCount).toBe(2);
      expect(regGet.callCount).toBe(2);
    });
  });

});
