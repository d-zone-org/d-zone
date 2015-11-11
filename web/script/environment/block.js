'use strict';
var inherits = require('inherits');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

module.exports = Block;
inherits(Block, WorldObject);

function Block(style,x,y,z) {
    WorldObject.call(this, {position:{x:x,y:y,z:z},size:{x:16,y:16,z:17}});
    var self = this;
    this.style = style;
    this.sheet = new Sheet('block');
    this.variation = util.randomIntRange(0,this.sheet.map[this.style].length-1);
    this.on('draw',function(canvas) { canvas.drawImageIso(self); });
}

Block.prototype.getSprite = function() {
    return this.sheet.map[this.style][this.variation];
};