/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const memory = require('./memory');
const cpu = require('./cpu');
const screenBuffer = require('./screen').screenBuffer();
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

    console.log(`At 0x${pc.toString(16)} with 0x${opcode.toString(16)}`);

    switch (opcode & 0xF000) {
      case 0x0000:
        switch (opcode) {
          case 0x00EE:
            pc = instructions.ret();
            break;

          default:
            console.log('Nothing to see here..');
            pc = instructions.missing();
        }
        break;

      case 0x1000:
        pc = instructions.jp(args.nnn);
        break;

      case 0x2000:
        pc = instructions.call(args.nnn);
        break;

      case 0x3000:
        pc = instructions.skipIfValueEqual(args.x, args.kk);
        break;

      case 0x4000:
        pc = instructions.skipIfValueNotEqual(args.x, args.kk);
        break;

      case 0x6000:
        pc = instructions.insertValueIntoRegister(args.x, args.kk);
        break;

      case 0x7000:
        pc = instructions.addValueToRegister(args.x, args.kk);
        break;

      case 0x8000:
        switch (opcode & 0x000F) {
          case 0x0000:
            pc = instructions.copyRegister(args.x, args.y);
            break;

          case 0x0002:
            pc = instructions.bitAnd(args.x, args.y);
            break;

          case 0x0004:
            pc = instructions.addRegisters(args.x, args.y);
            break;

          case 0x0005:
            pc = instructions.subtractRegister(args.x, args.y);
            break;

          default:
            console.log('why this code?');
            pc = instructions.missing();
        }
        break;

      case 0xA000:
        pc = instructions.setRegisterI(args.nnn);
        break;

      case 0xC000:
        pc = instructions.missing();
        break;

      case 0xD000:
        pc = instructions.draw(args.x, args.y, args.n);
        break;

      case 0xE000:
        switch (opcode & 0x00FF) {
          case 0x00A1:
            pc = instructions.missing();
            break;

          default:
            console.log('not an accepted opcode');
            pc = instructions.missing();
        }
        break;

      case 0xF000:
        switch (opcode & 0x00FF) {
          case 0x007:
            pc = instructions.missing();
            break;

          case 0x0015:
            pc = instructions.missing();
            break;

          case 0x0018:
            pc = instructions.missing();
            break;

          case 0x0029:
            pc = instructions.missing();
            break;

          case 0x0033:
            pc = instructions.missing();
            break;

          case 0x0065:
            pc = instructions.missing();
            break;

          default:
            console.log('some opcode');
            pc = instructions.missing();
        }
        break;

      default:
        console.log('what real fall through looks like');
        pc = instructions.missing();
    }

    if (pc >= memory.size) {
      run = false;
    }
  }
};

module.exports = main;
