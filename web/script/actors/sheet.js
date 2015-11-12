'use strict';
var SpriteSheet = require('./../engine/spritesheet.js');

var map = {
    actor: {
        online: {
            north: { x: 28, y: 0, w: 14, h: 14 },
            south: { x: 0, y: 0, w: 14, h: 14 },
            east: { x: 14, y: 0, w: 14, h: 14 },
            west: { x: 28, y: 0, w: 14, h: 14 }
        },
        idle: {
            north: { x: 56, y: 0, w: 14, h: 14 },
            south: { x: 42, y: 0, w: 14, h: 14 },
            east: { x: 56, y: 0, w: 14, h: 14 },
            west: { x: 42, y: 0, w: 14, h: 14 }
        },
        offline: {
            north: { x: 84, y: 0, w: 14, h: 14 },
            south: { x: 70, y: 0, w: 14, h: 14 },
            east: { x: 84, y: 0, w: 14, h: 14 },
            west: { x: 70, y: 0, w: 14, h: 14 }
        }
    }
};
var image = new SpriteSheet('actors.png',map);

module.exports = Sheet;

function Sheet(sprite) {
    this.image = image;
    this.map = map[sprite];
}