/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const fs = require('fs');

const instructionCounts = {
  '0nnn': [],
  '00E0': [],
  '00EE': [],
  '1nnn': [],
  '2nnn': [],
  '3xkk': [],
  '4xkk': [],
  '5xy0': [],
  '6xkk': [],
  '7xkk': [],
  '8xy0': [],
  '8xy1': [],
  '8xy2': [],
  '8xy3': [],
  '8xy4': [],
  '8xy5': [],
  '8xy6': [],
  '8xy7': [],
  '8xyE': [],
  '9xy0': [],
  'Annn': [],
  'Bnnn': [],
  'Cxkk': [],
  'Dxyn': [],
  'Ex9E': [],
  'ExA1': [],
  'Fx07': [],
  'Fx0A': [],
  'Fx15': [],
  'Fx18': [],
  'Fx1E': [],
  'Fx29': [],
  'Fx33': [],
  'Fx55': [],
  'Fx65': [],
  unknown: []
};

const loadToMemory = function(memory, data, offset = 0) {
  const modifiedMemory = memory;
  for (let i = 0; i < data.length; i += 1) {
    if (i >= memory.length) {
      throw new Error('Data longer than available memory');
    }

    modifiedMemory[i + offset] = data[i];
  }

  return modifiedMemory;
};

const disassembler = function(file) {
  let bufferMemory = Buffer.alloc(4096);
  bufferMemory = loadToMemory(bufferMemory, file, 512);
  console.log(`Memory: ${bufferMemory.toString('hex')}`);

  let pc = 0x200;
  let run = true;

  while (run) {
    console.log(`Current PC: ${pc}`);

    const opcode = bufferMemory[pc] << 8 | bufferMemory[pc + 1];
    const prettyop = `0x${opcode.toString(16).toUpperCase()}`;
    console.log(`Received: ${prettyop}`);

    if ((opcode & 0xFFFF) === 0x0000) { run = false; }

    switch (opcode & 0xF000) {
      case 0x0000:
        switch (opcode) {
          case 0x00E0:
            instructionCounts['00E0'].push(prettyop);
            console.log('CLS');
            break;
          case 0x00EE:
            instructionCounts['00EE'].push(prettyop);
            console.log('RET');
            break;
          default:
            instructionCounts['0nnn'].push(prettyop);
            console.log('SYS');
        }
        break;

      case 0x1000:
        instructionCounts['1nnn'].push(prettyop);
        console.log('JP addr');
        break;
      case 0x2000:
        instructionCounts['2nnn'].push(prettyop);
        console.log('CALL addr');
        break;
      case 0x3000:
        instructionCounts['3xkk'].push(prettyop);
        console.log('SE Vx, byte');
        break;
      case 0x4000:
        instructionCounts['4xkk'].push(prettyop);
        console.log('SNE Vx, byte');
        break;
      case 0x5000:
        instructionCounts['5xy0'].push(prettyop);
        console.log('SE Vx, Vy');
        break;
      case 0x6000:
        instructionCounts['6xkk'].push(prettyop);
        console.log('LD Vx, byte');
        break;
      case 0x7000:
        instructionCounts['7xkk'].push(prettyop);
        console.log('ADD Vx, byte');
        break;

      case 0x8000:
        switch (opcode & 0x000F) {
          case 0x0000:
            instructionCounts['8xy0'].push(prettyop);
            console.log('LD Vx, Vy');
            break;
          case 0x0001:
            instructionCounts['8xy1'].push(prettyop);
            console.log('OR Vx, Vy');
            break;
          case 0x0002:
            instructionCounts['8xy2'].push(prettyop);
            console.log('AND Vx, Vy');
            break;
          case 0x0003:
            instructionCounts['8xy3'].push(prettyop);
            console.log('XOR Vx, Vy');
            break;
          case 0x0004:
            instructionCounts['8xy4'].push(prettyop);
            console.log('ADD Vx, Vy');
            break;
          case 0x0005:
            instructionCounts['8xy5'].push(prettyop);
            console.log('SUB Vx, Vy');
            break;
          case 0x0006:
            instructionCounts['8xy6'].push(prettyop);
            console.log('SHR Vx {, Vy}');
            break;
          case 0x0007:
            instructionCounts['8xy7'].push(prettyop);
            console.log('SUBN Vx, Vy');
            break;
          case 0x000E:
            instructionCounts['8xyE'].push(prettyop);
            console.log('SHL Vx {, Vy}');
            break;
        }
        break;

      case 0x9000:
        instructionCounts['9xy0'].push(prettyop);
        console.log('SNE Vx, Vy');
        break;
      case 0xA000:
        instructionCounts['Annn'].push(prettyop);
        console.log('LD I, addr');
        break;
      case 0xB000:
        instructionCounts['Bnnn'].push(prettyop);
        console.log('JP V0, addr');
        break;
      case 0xC000:
        instructionCounts['Cxkk'].push(prettyop);
        console.log('RND Vx, byte');
        break;
      case 0xD000:
        instructionCounts['Dxyn'].push(prettyop);
        console.log('DRW Vx, Vy, nibble');
        break;

      case 0xE000:
        switch (opcode & 0x00FF) {
          case 0x009E:
            instructionCounts['Ex9E'].push(prettyop);
            console.log('SKP Vx');
            break;
          case 0x00A1:
            instructionCounts['ExA1'].push(prettyop);
            console.log('SKNP Vx');
            break;
        }
        break;

      case 0xF000:
        switch (opcode & 0x00FF) {
          case 0x0007:
            instructionCounts['Fx07'].push(prettyop);
            console.log('LD Vx, DT');
            break;
          case 0x000A:
            instructionCounts['Fx0A'].push(prettyop);
            console.log('LD Vx, K');
            break;
          case 0x0015:
            instructionCounts['Fx15'].push(prettyop);
            console.log('LD DT, Vx');
            break;
          case 0x0018:
            instructionCounts['Fx18'].push(prettyop);
            console.log('LD ST, Vx');
            break;
          case 0x001E:
            instructionCounts['Fx1E'].push(prettyop);
            console.log('ADD I, Vx');
            break;
          case 0x0029:
            instructionCounts['Fx29'].push(prettyop);
            console.log('LD F, Vx');
            break;
          case 0x0033:
            instructionCounts['Fx33'].push(prettyop);
            console.log('LD B, Vx');
            break;
          case 0x0055:
            instructionCounts['Fx55'].push(prettyop);
            console.log('LD [I], Vx');
            break;
          case 0x0065:
            instructionCounts['Fx65'].push(prettyop);
            console.log('LD Vx, [I]');
            break;
        }
        break;
      default:
        instructionCounts.unknown.push(prettyop);
        console.log('unknown');
    }

    console.log('---');

    pc += 2;
    if (pc >= bufferMemory.length) {
      run = false;
    }
  }

  console.log(instructionCounts);

  console.log('\n----- Counts -----\n');
  for(let key in instructionCounts) {
    if (instructionCounts.hasOwnProperty(key)) {
      console.log(`${key}: ${instructionCounts[key].length}`);
    }
  }

};

const loadFile = function(fileName) {
  return fs.readFileSync(fileName);
};

module.exports = disassembler;

// dissassembler(loadFile('../roms/GAMES/PONG'));
