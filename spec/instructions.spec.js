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

    it('SE Vx, byte increments counter', () => {
      const regMock = sinon.mock(cpu.register);
      regMock.expects("get").once().withExactArgs(0).returns(0xFA);
      cpu.pc._pointer = 0x200;

      instructions.initialize(cpu, null);

      const newPC = instructions.skipIfValueEqual(0, 0xFA);
      expect(newPC).toBe(0x204);

      regMock.verify();
    });

    it('SE Vx, byte does nothing', () => {
      const regMock = sinon.mock(cpu.register);
      regMock.expects("get").once().withExactArgs(0).returns(0xFA);
      cpu.pc._pointer = 0x200;

      instructions.initialize(cpu, null);

      const newPC = instructions.skipIfValueEqual(0, 0xAA);
      expect(newPC).toBe(0x202);

      regMock.verify();
    });

  });

  describe('Skip if register x does not equal value', () => {

    it('SNE Vx, byte skips next instruction', () => {
      const regMock = sinon.mock(cpu.register);
      regMock.expects("get").once().withExactArgs(0).returns(0xFA);
      cpu.pc._pointer = 0x200;

      instructions.initialize(cpu, null);

      const newPC = instructions.skipIfValueNotEqual(0, 0xAA);
      expect(newPC).toBe(0x204);

      regMock.verify();
    });

    it('SNE Vx, byte continues to next instruction', () => {
      const regMock = sinon.mock(cpu.register);
      regMock.expects("get").once().withExactArgs(0).returns(0xFA);
      cpu.pc._pointer = 0x200;

      instructions.initialize(cpu, null);

      const newPC = instructions.skipIfValueNotEqual(0, 0xFA);
      expect(newPC).toBe(0x202);

      regMock.verify();
    });

  });

});
