/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const sinon = require('sinon');
const cpu = require('../src/cpu');
const memory = require('../src/memory');
const instructions = require('../src/instructions');

describe('Instructions', () => {

  it('JP moves program counter to a new address', () => {
    const jumpToAddress = 0x352;

    const mock = sinon.mock(cpu.pc);
    mock.expects("set").once().returns(0x352);
    instructions.initialize(cpu);

    const newPC = instructions.jp(jumpToAddress);
    expect(newPC).toBe(0x352);

    mock.verify();
  });

  it('CALL executes subroutine at address', () => {
    const cpuMock = sinon.mock(cpu.pc);
    cpuMock.expects("set").once().returns(0x352);
    const stackSpy = sinon.spy(memory.stack, "push");

    // T_T
    memory.initialize();
    cpu.initialize();

    instructions.initialize(cpu, memory);

    const newPC = instructions.call(0x352);
    expect(newPC).toBe(0x352);
    expect(memory.stack.push.calledOnce).toBe(true);

    cpuMock.verify();
  });

  describe('Skip if register equals value', () => {

    let regMock = null;

    beforeEach(() => {
      regMock = sinon.mock(cpu.register);
      regMock.expects("get").once().withExactArgs(0).returns(0xFA);
      cpu.pc._pointer = 0x200;

      instructions.initialize(cpu, null);
    });

    afterEach(() => {
      regMock.verify();
    });

    it('SE Vx, byte increments counter', () => {
      const newPC = instructions.skipIfValueEqual(0, 0xFA);
      expect(newPC).toBe(0x204);
    });

    it('SE Vx, byte does nothing', () => {
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
    });

    it('SNE Vx, byte skips next instruction', () => {
      const newPC = instructions.skipIfValueNotEqual(0, 0xAA);
      expect(newPC).toBe(0x204);
    });

    it('SNE Vx, byte continues to next instruction', () => {
      const newPC = instructions.skipIfValueNotEqual(0, 0xFA);
      expect(newPC).toBe(0x202);
    });

  });

  describe('Skip if registers are equal', () => {

    it('Skips next instruction', () => {
      const regMock = sinon.mock(cpu.register);
      regMock.expects("get").atMost(2).returns(0xFA);
      cpu.pc._pointer = 0x200;

      instructions.initialize(cpu, null);

      const newPC = instructions.skipIfRegistersEqual(0, 1);
      expect(newPC).toBe(0x204);

      regMock.verify();
    });

    it('Continues to next instruction', () => {
      const regStub = sinon.stub(cpu.register, "get");
      regStub
        .onFirstCall().returns(0xFA)
        .onSecondCall().returns(0xAA);
      cpu.pc._pointer = 0x200;

      instructions.initialize(cpu, null);

      const newPC = instructions.skipIfRegistersEqual(0, 1);
      expect(newPC).toBe(0x202);
      expect(regStub.calledTwice).toBe(true);
    });

  });

  it('Insert value into register', () => {
    cpu.pc._pointer = 0x200;
    instructions.initialize(cpu, null);

    const newPC = instructions.insertValueIntoRegister(0, 0xA1);
    expect(newPC).toBe(0x202);
    expect(cpu.register._vReg[0]).toBe(0xA1);
  });

  it('Adds value to register', () => {
    const mockCPU = { register: { set: () => {} }, pc: {} };
    mockCPU.register.get = (registerIndex) => { return 0x01; };
    mockCPU.pc.next = () => { return 0x202; };
    const regSet = sinon.stub(mockCPU.register, "set");

    instructions.initialize(mockCPU, null);

    const newPC = instructions.addValueToRegister(0, 0x01);
    expect(newPC).toBe(0x202);
    expect(regSet.calledOnce).toBe(true);

    regSet.reset();
  });

});
