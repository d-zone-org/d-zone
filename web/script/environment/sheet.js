'use strict';
var SpriteSheet = require('./../engine/spritesheet.js');

var map = {
    tile: {
        plain: {x: 132, y: 0, w: 33, h: 18, ox: -1, oy: -1},
        grass: {x: 0, y: 0, w: 33, h: 19, ox: -1, oy: -1}
    },
    halfBlock: {
        plain: {x: 165, y: 0, w: 33, h: 26, ox: -1, oy: -1}
    },
    block: {
        plain: {x: 198, y: 0, w: 33, h: 34, ox: -1, oy: -1}
    }
};
var image = new SpriteSheet('environment.png');
image.once('loaded',function(canvas) {
    image.img = canvas;
});

module.exports = Sheet;

function Sheet(spriteName) {
    this.map = JSON.parse(JSON.stringify(map[spriteName]));
}

Sheet.prototype.getSprite = function() {
    if(!image.img) return;
    return image.img;
};