/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const screen = require('../src/screen');
const logger = { log: jest.fn() };

describe('ScreenBuffer', () => {

  it('starts empty', () => {
    const screenBuffer = screen.screenBuffer();
    expect(screenBuffer.currentState().length).toBe(0);
  });

  it('is initialized', () => {
    const screenBuffer = screen.screenBuffer();
    screenBuffer.initialize(logger);

    const buffer = screenBuffer.currentState();
    expect(buffer.length).toBe(32);

    for (let i = 0; i < buffer.length; i += 1) {
      expect(buffer[i].length).toBe(64);
    }
  });

  describe('drawSprite', () => {
    let sb;
    beforeEach(() => {
      sb = screen.screenBuffer();
      sb.initialize(logger);
    });

    it('should set 0,0 to active', () => {
      let state = sb.currentState();
      expect(state[0][0]).toBe(0);

      const hasCollided = sb.drawSprite({ x: 0, y: 0 }, [[1]]);
      state = sb.currentState();
      expect(state[0][0]).toBe(1);
      expect(hasCollided).toBe(false);
    });

    it('should draw at 0,0 and 1,0', () => {
      let state = sb.currentState();
      expect(state[0][0]).toBe(0);
      expect(state[0][1]).toBe(0);

      const hasCollided = sb.drawSprite({ x: 0, y: 0 }, [[1],[1]]);
      expect(state[0][0]).toBe(1);
      expect(state[0][1]).toBe(1);
      expect(hasCollided).toBe(false);
    });

    it('should have a collision on the second draw at 0,0', () => {
      let state = sb.currentState();
      expect(state[0][0]).toBe(0);

      let hasCollided = sb.drawSprite({ x: 0, y: 0 }, [[1]]);
      state = sb.currentState();
      expect(state[0][0]).toBe(1);
      expect(hasCollided).toBe(false);

      hasCollided = sb.drawSprite({ x: 0, y: 0 }, [[1]]);
      state = sb.currentState();
      expect(state[0][0]).toBe(0);
      expect(hasCollided).toBe(true);
    });
  });

  describe('Toggling', () => {
    it('toggles 0,0 to 1 then to 0', () => {
      const sb = screen.screenBuffer();
      sb.initialize(logger);
      expect(sb.currentState()[0][0]).toBe(0);

      sb.toggle(0,0);
      expect(sb.currentState()[0][0]).toBe(1);

      sb.toggle(0,0);
      expect(sb.currentState()[0][0]).toBe(0);
    });
  });

});
