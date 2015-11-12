'use strict';
var SpriteSheet = require('./../engine/spritesheet.js');

var map = {
    block: {
        plain: [
            {x: 66, y: 0, w: 33, h: 34, offset: {x: -1, y: -1}}
        ]
    },
    halfBlock: {
        plain: [
            {x: 33, y: 0, w: 33, h: 26, offset: {x: -1, y: -1}}
        ]
    },
    tile: {
        plain: [
            {x: 0, y: 0, w: 33, h: 18, offset: {x: -1, y: -1}}
        ],
        grass: [
            {x: 0, y: 34, w: 33, h: 19, offset: {x: -1, y: -1}},
            {x: 0, y: 53, w: 33, h: 19, offset: {x: -1, y: -1}},
            {x: 0, y: 72, w: 33, h: 19, offset: {x: -1, y: -1}},
            {x: 0, y: 91, w: 33, h: 19, offset: {x: -1, y: -1}}
        ]
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