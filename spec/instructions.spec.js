/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const sinon = require('sinon');
const cpu = require('../src/cpu');
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

});
