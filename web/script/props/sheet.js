'use strict';

var map = {
    beacon: { 
        main: {x: 0, y: 0, w: 31, h: 56, ox: -1, oy: -1},
        light: {x: 31, y: 0, w: 5, h: 4, ox: 13, oy: 0}
    }
};

module.exports = Sheet;

function Sheet(spriteName) {
    this.map = JSON.parse(JSON.stringify(map[spriteName]));
}