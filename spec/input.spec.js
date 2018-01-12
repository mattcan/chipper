/**
 * Chipper - A CHIP-8 emulator under the GPL-3.0
 * Please see LICENSE in the root for full details
 * Copyright (C) 2017  Matthew Cantelon
 **/

 const input = require('../src/input');

 describe('input', () => {
    it('should return undefined for the current key', () => {
        expect(input.getCurrentKey()).toBeUndefined();
    });

    it('should set current key pressed to \'2\'', () => {
        input.handleKeyDown('2', { name: '2' });
        expect(input.getCurrentKey()).toBe(0x1);
    })
 });
