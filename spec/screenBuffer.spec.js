/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const screen = require('../src/screen');

describe('ScreenBuffer', () => {

  it('starts empty', () => {
    const screenBuffer = screen.screenBuffer();
    expect(screenBuffer.currentState().length).toBe(0);
  });

  it('is initialized', () => {
    const screenBuffer = screen.screenBuffer();
    screenBuffer.initialize();

    const buffer = screenBuffer.currentState();
    expect(buffer.length).toBe(32);

    for (let i = 0; i < buffer.length; i += 1) {
      expect(buffer[i].length).toBe(64);
    }
  });

  describe('Toggling', () => {
    it('toggles 0,0 to 1 then to 0', () => {
      const sb = screen.screenBuffer();
      sb.initialize();
      expect(sb.currentState()[0][0]).toBe(0);

      sb.toggle(0,0);
      expect(sb.currentState()[0][0]).toBe(1);

      sb.toggle(0,0);
      expect(sb.currentState()[0][0]).toBe(0);
    });
  });

});
