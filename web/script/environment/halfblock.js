'use strict';
var inherits = require('inherits');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

module.exports = HalfBlock;
inherits(HalfBlock, WorldObject);

function HalfBlock(style,x,y,z) {
    WorldObject.call(this, {position:{x:x,y:y,z:z},size:{x:16,y:16,z:9}});
    var self = this;
    this.style = style;
    this.sheet = new Sheet('halfBlock');
    this.variation = util.randomIntRange(0,this.sheet.map[this.style].length-1);
    this.on('draw',function(canvas) { canvas.drawImageIso(self); });
}

HalfBlock.prototype.getSprite = function() {
    return {
        metrics: this.sheet.map[this.style][this.variation],
        image: this.sheet.getSprite()
    }
};