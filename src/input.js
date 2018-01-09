/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

// TODO actually map keys in a sensible manner
const keymap = {
    '1': 0x1,
    '2': 0x2,
    '3': 0x3,
    '4': 0x4,
    '5': 0x5,
    '6': 0x6,
    '7': 0x7,
    '8': 0x8,
    '9': 0x9,
    'a': 0xA,
    'b': 0xB,
    'c': 0xC,
    'd': 0xD,
    'e': 0xE,
    'f': 0xF,
    'g': 0x10
};

const createListener = function (setKey) {
    process.stdin.on('keypress', function (str, key) {
        // no modifiers allowed
        if (key.ctrl || key.meta || key.shift) { return; }

        // this is shitty, theres no keyup to clear things
        setKey(keymap[key.name]);
    });
};

module.exports = createListener;
