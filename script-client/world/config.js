'use strict';

var configLoader = require('configloader');

module.exports = new configLoader({
    sizeFactor: 1,
    density: 0.5, // Amount of land generated (0 - 1)
    centeredness: 1, // How centralized the land is (0 - 1)
    removeIslands: true,
    flowerPatchesFactor: 1,
    sprites: {
        beacon: {
            sheet: 'props',
            sheetX: 0,
            sheetY: 0,
            sheetW: 31,
            sheetH: 56,
            dox: -16,
            doy: -42
        }
    }
});