'use strict';
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
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
var image = new SpriteSheet('actors.png');
image.once('loaded',function(canvas) {
    image.img = canvas;
    Sheet.prototype.emit('loaded');
});

module.exports = Sheet;
inherits(Sheet, EventEmitter);

function Sheet(spriteName) {
    this.map = JSON.parse(JSON.stringify(map[spriteName]));
}

Sheet.prototype.getSprite = function() {
    if(!image.img) return;
    return image.img;
};

Sheet.prototype.onLoad = function(cb) {
    image.once('loaded',cb);
};