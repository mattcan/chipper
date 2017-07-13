/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/

const memory = require('../src/memory');

describe('Memory', () => {

  it('has an empty buffer', () => {
    expect(memory._buf).toEqual([]);
  });

  it('is initialized', () => {
    memory.initialize();
    expect(memory._buf.length).toBe(4096);
    expect(memory._buf[0]).not.toBe(0x00);
    expect(memory._buf[0x50]).toBe(0x00);
  });

  it('has a program loaded', () => {
    memory.loadProgram([0x00, 0xE0, 0x12, 0x00]);
    expect(memory._buf[0x201]).toBe(0xE0);
  });

  it('gets memory at specific location', () => {
    memory.loadProgram([0x00, 0xE0, 0x12, 0x00]);
    expect(memory._getAt(0x201)).toBe(0xE0);
  });

  it('can set a byte at specific location', () => {
    memory.initialize();
    expect(memory._buf[0]).toBe(0xF0);

    memory._setAt(0, 0xA0);
    expect(memory._buf[0]).toBe(0xA0);
  });

  it('fails when setting more than a byte', () => {
    memory.initialize();
    expect(memory._buf[0]).toBe(0xF0);

    memory._setAt(0, 0x200);
    expect(memory._buf[0]).toBe(0x0);
  });

  describe('Stack', () => {

    it('can push a value', () => {
      memory.initialize();
      memory.stack.push(0x201);

      expect(memory._buf[0x1DE]).toBe(0x20);
    });

    it('throws an error when pushing more than 16 values', () => {
      memory.initialize();
      for(let i = 0; i < 16; i += 1) {
        memory.stack.push(0x20 | i);
      }

      expect(function () {
        memory.stack.push(0xAA);
      }).toThrow();
    });

    it('returns the last item placed onto the stack', () => {
      memory.initialize();
      memory.stack.push(0x231);
      expect(memory._buf[0x1DE]).toBe(0x20);
      expect(memory._buf[0x1DF]).toBe(0x31);

      const value = memory.stack.pop();
      expect(value).toBe(0x231);
    });

  });
});
