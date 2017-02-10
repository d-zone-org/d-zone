'use strict';

var configLoader = require('configloader');

module.exports = new configLoader({
    sizeFactor: 1,
    density: 0.5,
    removeIslands: true,
    flowerPatchesFactor: 1,
    beacon: {
        sheet: 'props',
        sheetX: 0,
        sheetY: 0,
        sheetW: 31,
        sheetH: 56,
        dox: -16,
        doy: -42
    }
});