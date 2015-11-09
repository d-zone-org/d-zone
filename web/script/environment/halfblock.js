'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

module.exports = HalfBlock;
inherits(HalfBlock, WorldObject);

function HalfBlock(x,y,z) {
    var halfBlock = new WorldObject({position:{x:x,y:y,z:z},size:{x:16,y:16,z:9}});
    this.object = halfBlock;
    halfBlock.sheet = new Sheet('halfBlock');
    halfBlock.getSprite = function() {
        return halfBlock.sheet.map;
    };
    halfBlock.on('draw',function(canvas) {
        canvas.drawImageIso(halfBlock);
    });
    return halfBlock;
}