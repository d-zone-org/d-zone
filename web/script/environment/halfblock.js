'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

var spriteX = 33;
var spriteY = 0;
var spriteWidth = 33;
var spriteHeight = 25;
var sheet = new Sheet({
    halfblock: { x: spriteX, y: spriteY, width: spriteWidth, height: spriteHeight }
});
var origin = { x: 17, y: 15 };

module.exports = HalfBlock;
inherits(HalfBlock, WorldObject);

function HalfBlock(x,y,z) {
    var tile = new WorldObject({position:{x:x,y:y,z:z}});
    tile.on('draw',function(canvas) {
        if(!sheet.sprite.loaded) return;
        canvas.drawImageIso(sheet.sprite.img,spriteX,spriteY,spriteWidth,spriteHeight,origin,
            tile.position.x,tile.position.y,tile.position.z);
    });
    return tile;
}