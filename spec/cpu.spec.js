/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const cpu = require('../src/cpu');

describe('CPU', () => {

  it('will initialize registers', () => {
    cpu.initialize();
    expect(cpu._vReg.length).toBe(8);
    expect(cpu._flag).toBe(false);
    expect(cpu._iReg.length).toBe(2);
    expect(cpu._sound.length).toBe(1);
    expect(cpu._halt.length).toBe(1);
  });

  it('will return current PC', () => {
    cpu.initialize();
    expect(cpu.getPC()).toBe(0x200);
  });

  it('will set the PC to 0x300', () => {
    cpu.initialize();
    expect(cpu._pc).toBe(0x200);

    cpu.setPC(0x300);
    expect(cpu._pc).toBe(0x300);
  });

  it('will continue to the next address', () => {
    cpu.initialize();
    expect(cpu._pc).toBe(0x200);

    const nextAddress = cpu.next();
    expect(nextAddress).toBe(0x202);
    expect(cpu._pc).toBe(0x202);
  });

});
