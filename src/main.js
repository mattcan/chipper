/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const memory = require('./memory');
const cpu = require('./cpu');

const init = function (program) {
  memory.initialize();
  memory.loadProgram(program);

  cpu.initialize(null);
};

const isNull = function (opcode) {
  return (opcode & 0xFFFF) === 0x0000;
};

const main = function (program) {
  init(program);

  let pc = cpu.pc.get();
  let run = true;
  while (run) {
    const opcode = memory.opCode(pc);
    if (isNull(opcode)) { break; }

    const args = memory.opArguments(opcode);

    console.log(`0x${opcode.toString(16)}`);
    console.log(args);
    console.log('----');

    pc = cpu.pc.next();
    if (pc >= memory.size) {
      run = false;
    }
  }
};

module.exports = main;
