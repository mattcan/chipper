/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const cpu = require('./cpu');
const input = require('./input');

const setupStdin = function () {
  const readline = require('readline');
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', input.handleKeyDown);
  input.handleKeyUp();
}

const init = function (program) {
  setupStdin();
  cpu.initialize(program);
};

const main = function (program, logger) {
  logger.log('We made it');
  init(program);
  cpu.run();

  /*
const isNull = function (opcode) {
  return (opcode & 0xFFFF) === 0x0000;
};
  let quit = false;
  let run = true;
  while (!quit) {
    const opcode = memory.opCode(pc);
    if (isNull(opcode)) {
      quit = true;
      continue;
    }

    const args = memory.opArguments(opcode);

    // console.log(`At 0x${pc.toString(16)} with 0x${opcode.toString(16)}`);

    if (run === false) { continue; }

    // display.render();

    if (pc >= memory.size) {
      quit = true;
    }
  }
  */
};

module.exports = main;
