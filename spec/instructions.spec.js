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

});
