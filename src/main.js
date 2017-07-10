/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const memory = require('./memory');

const init = function (program) {
  memory.initialize();
  memory.loadProgram(program);
};

const main = function (program) {
  init(program);
};

module.exports = main;
