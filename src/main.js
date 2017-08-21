/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const memory = require('./memory');
const cpu = require('./cpu');
const screenBuffer = require('./screen').screenBuffer;
const instructions = require('./instructions');

const init = function (program) {
  memory.initialize();
  memory.loadProgram(program);

  cpu.initialize();

  screenBuffer.initialize();

  instructions.initialize(cpu, memory, screenBuffer);
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

    switch (opcode && 0xF000) {
      case 0x0000:
        switch (opcode) {
          case 0x00EE:
            instructions.ret();
            break;
          default:
            console.log('Nothing to see here..');
        }
        break;

      case 0x1000:
        instructions.jp(args.nnn);
        break;
      
      case 0x2000:
        instructions.call(args.nnn);
        break;

      case 0x3000:
        instructions.skipIfValueEqual(args.x, args.kk);
        break;

      case 0x4000:
        instructions.skipIfValueNotEqual(args.x, args.kk);
        break;

      case 0x7000:
        instructions.addValueToRegister(args.x, args.kk);
        break;
    }

    /*
    console.log(`0x${opcode.toString(16)}`);
    console.log(args);
    console.log('----');
    */

    pc = cpu.pc.next();
    if (pc >= memory.size) {
      run = false;
    }
  }
};

module.exports = main;
