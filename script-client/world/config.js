'use strict';

var configLoader = require('configloader');

module.exports = new configLoader({
    sizeFactor: 1,
    density: 0.5, // Amount of land generated (0 - 1)
    centeredness: 1, // How centralized the land is (0 - 1)
    removeIslands: true,
    flowerPatchesFactor: 1,
    textures: {
        beacon: {
            sheet: 'props',
            frameX: 0,
            frameY: 0,
            frameW: 31,
            frameH: 56,
        }
    },
    sprites: {
        beacon: {
            texturePath: ['props', 'beacon'],
            dox: -16,
            doy: -42
        }
    }
});