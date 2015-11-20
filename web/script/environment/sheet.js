'use strict';

var map = {
    tile: {
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
        grass: {x: 0, y: 0, w: 33, h: 19, ox: -1, oy: -1}
    },
    halfBlock: {
        plain: {x: 165, y: 0, w: 33, h: 26, ox: -1, oy: -1}
    },
    block: {
        plain: {x: 198, y: 0, w: 33, h: 34, ox: -1, oy: -1}
    }
};

module.exports = Sheet;

function Sheet(spriteName) {
    this.map = JSON.parse(JSON.stringify(map[spriteName]));
}