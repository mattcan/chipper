/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const memory = require('./memory');

const PROGRAM_COUNTER_START = 0x200;

const init = function (program) {
  memory.initialize();
  memory.loadProgram(program);
};

const getOpcode = function (programCounter) {
  return memory.getAt(programCounter) << 8 | memory.getAt(programCounter + 1);
};

const getArguments = function (opcode) {
  return {
    nnn: (opcode & 0x0FFF),
    n: (opcode & 0x000F),
    x: (opcode & 0x0F00) >> 8,
    y: (opcode & 0x00F0) >> 4,
    kk: (opcode & 0x00FF)
  };
};

const isNull = function (opcode) {
  return (opcode & 0xFFFF) === 0x0000;
};

const main = function (program) {
  init(program);

  let pc = PROGRAM_COUNTER_START;
  let run = true;
  while (run) {
    const opcode = getOpcode(pc);
    if (isNull(opcode)) { break; }

    const args = getArguments(opcode);

    console.log(`0x${opcode.toString(16)}`);
    console.log(args);
    console.log('----');

    pc += 2;
    if (pc >= memory.size) {
      run = false;
    }
  }
};

module.exports = main;
