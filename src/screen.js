/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/


const screenBuffer = function () {
  const buffer = [];
  const verticalPixels = 32;
  const horizontalPixels = 64;
  let Logger;

  const initialize = function (logger) {
    reset();
    Logger = logger;
    return this;
  };

  // Returns true when toggling off to signify collision
  const toggle = function (x, y) {
    try {
      if (buffer[y][x] === 0) {
        Logger.log('Toggling, new value is 1', {x, y});
        buffer[y][x] = 1;
        return false;
      } else {
        Logger.log('Toggling, new value is 0', {x,y});
        buffer[y][x] = 0;
        return true;
      }
    } catch (e) {
      Logger.log('Error toggling', { msg: e.message, x, y });
      // Keep things moving to get those sweet, sweet logs
    }
  };

  const currentState = function () {
    return buffer;
  };

  const reset = function () {
    for (let i = 0; i < verticalPixels; i += 1) {

      const row = [];

      for (let j = 0; j < horizontalPixels; j += 1) {
        row.push(0);
      }

      buffer.push(row);
    }
  };

  // TODO screen wrapping
  // Currently this will blow the fuck up
  const drawSprite = (coords, sprite) => {
    if (!Array.isArray(sprite) || sprite.length === 0) {
      throw new Error('Drawing an empty sprite? For real?');
    }

    const {x, y} = coords;
    let collision = false;

    Logger.log('Drawing', { coords, sprite });

    for (let rowIdx = 0; rowIdx < sprite.length; rowIdx += 1) {
      const row = sprite[rowIdx];

      for (let colIdx = 0; colIdx < row.length; colIdx += 1) {
        let offsetX = rowIdx + x;
        let offsetY = colIdx + y;

        offsetX = offsetX > horizontalPixels ? offsetX - horizontalPixels : offsetX;
        offsetY = offsetY > verticalPixels ? offsetY - verticalPixels : offsetY;

        const hasCollided = toggle(offsetX, offsetY);
        if (hasCollided) { collision = true; }
      }
    }

    return collision;
  };

  return {
    initialize,
    reset,
    toggle,
    currentState,
    drawSprite
  };

};

const display = function () {
  const screen = require('axel');

  let screenBuffer;

  const initialize = function (sb) {
    screenBuffer = sb;
    return this;
  };

  const _screenPosition = (coords) => {
    const { x, y } = coords;
    const leftOffset = 10;
    const topOffset = 10;

    return { x: x + leftOffset, y: y + topOffset };
  };

  const render = function () {
    const pixelHeight = 0;
    const pixelWidth = 0;

    const state = screenBuffer.currentState();
    // TODO
    // should probably track previous state and only render
    // if updates have occurred

    screen.clear();
    screen.bg(255, 0, 0);

    for (let rowIdx = 0; rowIdx < state.length; rowIdx += 1) {
      const row = state[rowIdx];

      for (let columnIdx = 0; columnIdx < row.length; columnIdx += 1) {
        if (row[columnIdx] !== 1) {
          continue;
        }

        const { x, y } = _screenPosition({ x: rowIdx, y: columnIdx });
        screen.point(x, y);
      }
    }

    screen.cursor.restore();
  };

  return { render, initialize };
};

module.exports = {
  screenBuffer,
  display
};
