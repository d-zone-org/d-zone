'use strict';
var SpriteSheet = require('./../engine/spritesheet.js');

var map = {
    block: {
        plain: [
            {x: 66, y: 0, width: 33, height: 34, offset: {x: -1, y: -1}}
        ]
    },
    halfBlock: {
        plain: [
            {x: 33, y: 0, width: 33, height: 26, offset: {x: -1, y: -1}}
        ]
    },
    tile: {
        plain: [
            {x: 0, y: 0, width: 33, height: 18, offset: {x: -1, y: -1}}
        ],
        grass: [
            {x: 0, y: 18, width: 33, height: 18, offset: {x: -1, y: -1}},
            {x: 0, y: 36, width: 33, height: 18, offset: {x: -1, y: -1}},
            {x: 0, y: 54, width: 33, height: 18, offset: {x: -1, y: -1}},
            {x: 0, y: 72, width: 33, height: 18, offset: {x: -1, y: -1}}
        ]
    }
};
var image = new SpriteSheet('environment.png', map);

module.exports = Sheet;

function Sheet(sprite) {
    this.image = image;
    this.map = map[sprite];
}