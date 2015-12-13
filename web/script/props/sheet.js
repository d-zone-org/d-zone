'use strict';

var map = {
    beacon: { 
        main: {x: 0, y: 0, w: 31, h: 56, ox: -1, oy: -1},
        light: {x: 31, y: 0, w: 5, h: 4, ox: 13, oy: 0}
    },
    seed: {
        plant: {x: 36, y: 0, w: 16, h: 22, ox: 2, oy: 2},
        orb: {x: 36, y: 22, w: 8, h: 8, ox: 8, oy: 4}
    }
};

module.exports = Sheet;

function Sheet(spriteName) {
    this.map = JSON.parse(JSON.stringify(map[spriteName]));
}