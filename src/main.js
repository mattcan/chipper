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

    console.log(`0x${opcode.toString(16)}`);

    pc += 2;
    if (pc >= memory.size) {
      run = false;
    }
  }
};

module.exports = main;
