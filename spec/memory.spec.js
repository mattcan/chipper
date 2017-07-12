/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/

const memory = require('../src/memory');

describe('Memory', () => {

  it('has an empty buffer', () => {
    expect(memory.buf).toEqual([]);
  });

  it('is initialized', () => {
    memory.initialize();
    expect(memory.buf.length).toBe(4096);
    expect(memory.buf[0]).not.toBe(0x00);
    expect(memory.buf[0x50]).toBe(0x00);
  });

  it('has a program loaded', () => {
    memory.loadProgram([0x00, 0xE0, 0x12, 0x00]);
    expect(memory.buf[0x201]).toBe(0xE0);
  });

  it('gets memory at specific location', () => {
    memory.loadProgram([0x00, 0xE0, 0x12, 0x00]);
    expect(memory.getAt(0x201)).toBe(0xE0);
  });

  describe('Stack', () => {

    xit('can push a value', () => {
      memory.initialize();
      memory.stack.push(0x201);
      console.log(memory.buf[0x1DE].toString(16), memory.buf[0x1DF], memory.stack.memParent.buf[0x1DE]);
      expect(memory.buf[0x1DE]).toBe(0x20);
    });
  });
});
