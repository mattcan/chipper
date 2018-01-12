/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const keymap = {
    '2': 0x1,
    '3': 0x2,
    '4': 0x3,
    '5': 0x4,
    'w': 0x5,
    'e': 0x6,
    'r': 0x7,
    't': 0x8,
    's': 0x9,
    'd': 0xA,
    'f': 0xB,
    'g': 0xC,
    'x': 0xD,
    'c': 0xE,
    'v': 0xF,
    'b': 0x10
};

const input = function () {
  let lastKeyPress;
  let currentlyPressed;

  const handleKeyDown = function (str, key) {
    console.log('a key was pressed');

    // quit
    if (key.ctrl && key.name === 'c') {
      console.log('quit keys pressed');
      process.exit();
    }

    // no modifiers allowed
    if (key.ctrl || key.meta || key.shift) { return; }

    // this is shitty, theres no keyup to clear things
    currentlyPressed = keymap[key.name];
    lastKeyPress = new Date();
  };

  const handleKeyUp = function () {
    const intervalId = setInterval(function () {
      const span = lastKeyPress !== undefined
        ? (new Date()) - lastKeyPress
        : 0;
      if (span > 25) {
        lastKeyPress = undefined;
        currentlyPressed = undefined;
      }
    }, 25);

    return intervalId;
  };

  const getCurrentKey = function () { return currentlyPressed; };

  return {
    handleKeyDown,
    handleKeyUp,
    getCurrentKey
  };
};

module.exports = input();
