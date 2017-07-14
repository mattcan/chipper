/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/

module.exports = {
  initialize: function () {
    this._vReg = Buffer.alloc(8);
    this._flag = false;
    this._iReg = Buffer.alloc(2);
    this._sound = Buffer.alloc(1);
    this._halt = Buffer.alloc(1);
  }
};
