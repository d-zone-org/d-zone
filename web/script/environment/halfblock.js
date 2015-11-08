'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

var spriteX = 33;
var spriteY = 0;
var spriteWidth = 33;
var spriteHeight = 26;
var sheet = new Sheet({
    halfblock: { x: spriteX, y: spriteY, width: spriteWidth, height: spriteHeight }
});

module.exports = HalfBlock;
inherits(HalfBlock, WorldObject);

function HalfBlock(x,y,z) {
    var halfBlock = new WorldObject({position:{x:x,y:y,z:z},size:{x:16,y:16,z:9}});
    halfBlock.on('draw',function(canvas) {
        if(!sheet.sprite.loaded) return;
        canvas.drawImageIso(sheet.sprite.img,spriteX,spriteY,spriteWidth,spriteHeight,halfBlock);
    });
    return halfBlock;
}