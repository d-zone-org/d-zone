'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

module.exports = Block;
inherits(Block, WorldObject);

function Block(x,y,z) {
    var block = new WorldObject({position:{x:x,y:y,z:z},size:{x:16,y:16,z:17}});
    this.object = block;
    block.sheet = new Sheet('block');
    block.getSprite = function() {
        return block.sheet.map;
    };
    block.on('draw',function(canvas) {
        canvas.drawImageIso(block);
    });
    return block;
}