/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/

const blessed = require('blessed');

const screenBuffer = function () {
  const buffer = [];

  const initialize = function () {
    const verticalPixels = 32;
    const horizontalPixels = 64;

    for (let i = 0; i < verticalPixels; i += 1) {

      const row = [];

      for (let j = 0; j < horizontalPixels; j += 1) {
        row.push(0);
      }

      buffer.push(row);
    }

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

  return {
    initialize,
    toggle,
    currentState
  };

};

const screen = blessed.screen({
  tput: true,
  smartCSR: true,
  //dump: __dirname + '/../file.log',
  warnings: true,
  title: 'Chipper'
});

const display = blessed.box({
  top: 'center',
  left: 'center',
  width: '35%',
  height: '70%',
  content: 'He {bold}ll{/bold} ooh',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    border: {
      fg: '#ffffff'
    },
    hover: {
      bg: 'green'
    }
  },
  hide: true
});

screen.append(display);
display.focus();
screen.render();

display.key('enter', function(ch, key) {
  display.setContent('some text');
  screen.render();
});

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit();
});
