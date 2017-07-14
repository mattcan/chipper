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

});
