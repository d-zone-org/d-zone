'use strict';
var inherits = require('inherits');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

module.exports = HalfBlock;
inherits(HalfBlock, WorldObject);

function HalfBlock(style,x,y,z) {
    WorldObject.call(this, {position:{x:x,y:y,z:z},pixelSize:{x:16,y:16,z:9},height:0.5});
    this.style = style;
    this.sheet = new Sheet('halfBlock');
    this.variation = 0;
    var self = this;
    this.on('draw',function(canvas) { if(self.exists) canvas.drawEntity(self); });
}

HalfBlock.prototype.getSprite = function() {
    return { metrics: this.sheet.map[this.style]/*[this.variation]*/, image: 'environment' }
};