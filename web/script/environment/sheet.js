'use strict';

var map = {
    slab: {
        plain: {
            0: {x: 165, y: 0, w: 33, h: 24, ox: -1, oy: -1},
            16: {x: 165, y: 24, w: 33, h: 24, ox: -1, oy: -1},
            64: {x: 165, y: 48, w: 33, h: 24, ox: -1, oy: -1},
            80: {x: 165, y: 72, w: 33, h: 24, ox: -1, oy: -1},
            32: {x: 165, y: 96, w: 33, h: 39, ox: -1, oy: -1},
            128: {x: 165, y: 135, w: 33, h: 39, ox: -1, oy: -1},
            160: {x: 165, y: 174, w: 33, h: 39, ox: -1, oy: -1},
            96: {x: 165, y: 213, w: 33, h: 39, ox: -1, oy: -1},
            144: {x: 165, y: 252, w: 33, h: 39, ox: -1, oy: -1}
        },
        grass: {
            0: {x: 0, y: 0, w: 33, h: 18, ox: -1, oy: -2},
            1: {x: 0, y: 18, w: 33, h: 18, ox: -1, oy: -2}, 
            4: {x: 0, y: 36, w: 33, h: 18, ox: -1, oy: -2},
            5: {x: 0, y: 54, w: 33, h: 18, ox: -1, oy: -2},
            16: {x: 0, y: 0, w: 33, h: 18, ox: -1, oy: -2},
            32: {x: 0, y: 0, w: 33, h: 18, ox: -1, oy: -2},
            64: {x: 0, y: 0, w: 33, h: 18, ox: -1, oy: -2},
            80: {x: 0, y: 0, w: 33, h: 18, ox: -1, oy: -2},
            96: {x: 0, y: 0, w: 33, h: 18, ox: -1, oy: -2},
            128: {x: 0, y: 0, w: 33, h: 18, ox: -1, oy: -2},
            144: {x: 0, y: 0, w: 33, h: 18, ox: -1, oy: -2},
            160: {x: 0, y: 0, w: 33, h: 18, ox: -1, oy: -2}
        }
    }
};

module.exports = Sheet;

function Sheet(spriteName) {
    this.map = JSON.parse(JSON.stringify(map[spriteName]));
}