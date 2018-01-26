/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/
const fs = require('fs');

const openFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.open(path, 'a+', 0o666, (err, fd) => {
      if (err) { return reject(err); }
      return resolve(fd);
    });
  });
};

const closeFile = (fd) => {
  return new Promise((resolve, reject) => {
    fs.close(fd, (err) => {
      if (err) { return reject(err); }
      return resolve();
    })
  })
}

const writeLine = (fd, line) => {
  return new Promise((resolve, reject) => {
    fs.write(fd, `${line}\n`, (err, writtent, string) => {
      if (err) { return reject(err); }
      return resolve(string);
    });
  });
};

class Logger {
  constructor(programName) {
    this.fileName = this._formatFileName(programName);
    this.directory = './logs/';
  }

  _formatFileName (programName) {
    const dateString = `${(new Date()).toISOString()}`
      .replace(/\-/g, '')
      .replace(/\:/g, '')
      .replace(/\./g, '');

    return `${dateString}_${programName}`;
  }

  _line (message, details) {
    const time = Date.now();
    const data = JSON.stringify(details);
    const divider = '---';

    return `[${time}]: ${message}\n${data}\n${divider}`;
  }

  async log(message, details = {}) {
    if (!process.env.CHIPPER_DEBUG) { return; }

    let file;
    try {
      file = await openFile(`${this.directory}${this.fileName}`);
      await writeLine(file, this._line(message, details));
      await closeFile(file);
    } catch (e) {
      throw e;
    }
  }
};

module.exports = Logger;
