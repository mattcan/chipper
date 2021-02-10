I am probably not goint to work on this anymore
---
# Chipper [![Build Status](https://travis-ci.org/mattcan/chipper.svg?branch=master)](https://travis-ci.org/mattcan/chipper) [![Known Vulnerabilities](https://snyk.io/test/github/mattcan/chipper/badge.svg)](https://snyk.io/test/github/mattcan/chipper)


A CHIP-8 interpreter written in NodeJS and licensed under the GPL-3.0.

## ROMs

I haven't had a chance to look into the licensing around ROMs yet so you will
need to download your own.

## Usage

If you have some ROMs, you can run the VM using the following command:

```sh
cd /project/directory
node chip8.js vm path/to/roms/PONG
```

You can also run the disassembler

```sh
node chip8.js ds /path/to/rom/SOMEROM
```

## Tests

```sh
npm test
```

## TODO

[Project Board](https://trello.com/b/o27qNWtj)

## Sources

* http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#0.1
* http://mattmik.com/files/chip8/mastering/chip8.html
* https://github.com/mir3z/chip8-emu/blob/master/src/chip8-cpu.js
* https://en.wikipedia.org/wiki/CHIP-8
* https://github.com/alexanderdickson/Chip-8-Emulator/blob/master/scripts/chip8.js
