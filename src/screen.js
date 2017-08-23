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

  let screenBuffer;

  const initialize = function (sb) {
    this.screenBuffer = sb;
  };

  const render = function () {
    const pixelHeight = 0;
    const pixelWidth = 0;

    const state = this.screenBuffer.currentState();

    for (let rowIdx = 0; rowIdx < state.length; rowIdx += 1) {
      const row = state[rowIdx];

      for (let columnIdx = 0; columnDix < row.length; columnIdx += 1) {
        const col = row[columnIdx];

        // take a guess at how slow this is

      }
    }
  };

  return { render, initialize };
};

module.exports = {
  screenBuffer,
  display
};
