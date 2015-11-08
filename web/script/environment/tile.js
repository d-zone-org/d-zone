'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

var spriteX = 0;
var spriteY = 0;
var spriteWidth = 33;
var spriteHeight = 18;
var sheet = new Sheet({
    tile: { x: spriteX, y: spriteY, width: spriteWidth, height: spriteHeight }
});

module.exports = Tile;
inherits(Tile, WorldObject);

function Tile(x,y,z) {
    var tile = new WorldObject({position:{x:x,y:y,z:z},size:{x:16,y:16,z:1}});
    tile.on('draw',function(canvas) {
        if(!sheet.sprite.loaded) return;
        canvas.drawImageIso(sheet.sprite.img,spriteX,spriteY,spriteWidth,spriteHeight,tile);
    });
    return tile;
}