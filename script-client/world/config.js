'use strict';

var configLoader = require('configloader');

module.exports = new configLoader({
    worldSizeFactor: 1,
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