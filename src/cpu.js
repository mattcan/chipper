/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const OutOfBounds = require('./exceptions/OutOfBounds');
const instructions = require('./instructions');
const memory = require('./memory');
const screenBuffer = require('./screen').screenBuffer();
const display = require('./screen').display();

const PROGRAM_START = 0x200;
const CLOCK_SPEED = 60; // Hz

module.exports = {

  // Create all the private variables
  initialize: function (program, logger) {
    logger.log('Initializing CPU', { programSize: program.length })
    this.register._vReg = Buffer.alloc(16);
    this._iReg = Buffer.alloc(2);
    this._sound = Buffer.alloc(1);
    this._halt = Buffer.alloc(1);
    this.pc._pointer = PROGRAM_START;
    this._tickHandler = undefined;

    this._instructions = instructions.initialize(this);

    memory.initialize(logger);
    memory.loadProgram(program);

    this._sb = screenBuffer.initialize();
    this._display = display.initialize(this._sb);

    this._logger = logger;

    this._logger.log('CPU Initialized', {
      vReg: this.register._vReg,
      iReg: this._iReg,
      sound: this._sound,
      halt: this._halt,
      pointer: this.pc._pointer
    });
  },

  run: function () {
    const self = this;

    this._logger.log('Screen buffer starting state', this._sb.currentState());

    const tick = function () {
      return setInterval(function () {
        self.execute(self.decode());
        self._logger.log('Pre-render buffer', self._sb.currentState());
        self._display.render();
      }, 1000 / CLOCK_SPEED);
    };

    this._tickHandler = tick();
  },

  decode: function () {
    const pc = this.pc.get();
    const opcode = memory.getAt(pc) << 8 | memory.getAt(pc + 1);
    return {
      code: opcode,
      args: {
        nnn: (opcode & 0x0FFF),
        n: (opcode & 0x000F),
        x: (opcode & 0x0F00) >> 8,
        y: (opcode & 0x00F0) >> 4,
        kk: (opcode & 0x00FF)
      }
    };
  },

  execute: function (operation) {
    const args = operation.args;
    switch (operation.code & 0xF000) {
      case 0x0000:
        switch (operation.code) {
          case 0x00EE:
            this._instructions.ret();
            break;

          default:
            console.log('Nothing to see here..');
            this._instructions.missing();
        }
        break;

      case 0x1000:
        this._instructions.jp(args.nnn);
        break;

      case 0x2000:
        this._instructions.call(args.nnn);
        break;

      case 0x3000:
        this._instructions.skipIfValueEqual(args.x, args.kk);
        break;

      case 0x4000:
        this._instructions.skipIfValueNotEqual(args.x, args.kk);
        break;

      case 0x6000:
        this._instructions.insertValueIntoRegister(args.x, args.kk);
        break;

      case 0x7000:
        this._instructions.addValueToRegister(args.x, args.kk);
        break;

      case 0x8000:
        switch (operation.code & 0x000F) {
          case 0x0000:
            this._instructions.copyRegister(args.x, args.y);
            break;

          case 0x0002:
            this._instructions.bitAnd(args.x, args.y);
            break;

          case 0x0004:
            this._instructions.addRegisters(args.x, args.y);
            break;

          case 0x0005:
            this._instructions.subtractRegister(args.x, args.y);
            break;

          case 0x0007:
            this._instructions.subtractRegister(args.y, args.x);
            break;

          default:
            console.log('why this code?');
            this._instructions.missing();
        }
        break;

      case 0xA000:
        this._instructions.setRegisterI(args.nnn);
        break;

      case 0xC000:
        this._instructions.saveRandom(args.x, args.kk);
        break;

      case 0xD000:
        this._instructions.draw(args.x, args.y, args.n);
        break;

      case 0xE000:
        switch (operation.code & 0x00FF) {
          case 0x9E:
            this._instructions.missing();
            break;

          case 0x00A1:
            this._instructions.missing();
            break;

          default:
            console.log('not an accepted operation.code');
            this._instructions.missing();
        }
        break;

      case 0xF000:
        switch (operation.code & 0x00FF) {
          case 0x007:
            this._instructions.missing();
            break;

          case 0x0015:
            this._instructions.missing();
            break;

          case 0x0018:
            this._instructions.missing();
            break;

          case 0x0029:
            this._instructions.missing();
            break;

          case 0x0033:
            this._instructions.missing();
            break;

          case 0x0065:
            this._instructions.missing();
            break;

          default:
            console.log('some opcode');
            this._instructions.missing(operation.code);
        }
        break;

      default:
        console.log('what real fall through looks like');
        this._instructions.missing();
    }

  },

  getMemory: function () {
    return memory;
  },

  getScreenBuffer: function () {
    return screenBuffer;
  },

  register: {
    get: function (index) {
      if (index >= this._vReg.length || index < 0) {
        throw new OutOfBounds('Register only has 16 spaces');
      }

      return this._vReg[index];
    },

    set: function (index, value) {
      if (index >= this._vReg.length || index < 0) {
        throw new OutOfBounds('Cannot set undefined register');
      }

      this._vReg[index] = value;
    },

    getI: () => ( this._iReg ),

    setI: (val) => { this._iReg = val; }
  },

  pc: {
    _pointer: null,

    get: function () {
      return this._pointer;
    },

    set: function (address) {
      this._pointer = address;
      return this._pointer;
    },

    next: function () {
      return this.set(this._pointer + 2);
    }
  }
};
