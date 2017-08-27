/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/


const screenBuffer = function () {
  const buffer = [];
  const verticalPixels = 32;
  const horizontalPixels = 64;

  const initialize = function () {
    reset();
  };

  const toggle = function (x, y) {
    if (buffer[x][y] === 0) {
      buffer[x][y] = 1;
    } else {
      buffer[x][y] = 0;
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

  return {
    initialize,
    toggle,
    currentState
  };

};

const display = function () {
  const screen = require('axel');

  let screenBuffer;

  const initialize = function (sb) {
    screenBuffer = sb;
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
