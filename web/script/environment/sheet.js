'use strict';
var SpriteSheet = require('./../engine/spritesheet.js');

var map = {
    block: { x: 66, y: 0, width: 33, height: 34, offset: { x: -1, y: 0 } },
    halfBlock: { x: 33, y: 0, width: 33, height: 26, offset: { x: -1, y: 0 } },
    tile: { x: 0, y: 0, width: 33, height: 18, offset: { x: -1, y: 0 } }
};
var image = new SpriteSheet('environment.png',map);

module.exports = Sheet;

function Sheet(sprite) {
    this.image = image;
    this.map = map[sprite];
}