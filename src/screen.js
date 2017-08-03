/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/

const blessed = require('blessed');

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
