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
var origin = { x: 17, y: 8 };

module.exports = Tile;
inherits(Tile, WorldObject);

function Tile(x,y,z) {
    var tile = new WorldObject({position:{x:x,y:y,z:z}});
    tile.on('draw',function(canvas) {
        if(!sheet.sprite.loaded) return;
        canvas.drawImageIso(sheet.sprite.img,spriteX,spriteY,spriteWidth,spriteHeight,origin,
            tile.position.x,tile.position.y,tile.position.z);
    });
    return tile;
}