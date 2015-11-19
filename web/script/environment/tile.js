'use strict';
var inherits = require('inherits');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

module.exports = Tile;
inherits(Tile, WorldObject);

function Tile(style,x,y,z) {
    WorldObject.call(this, {position:{x:x,y:y,z:z},pixelSize:{x:16,y:16,z:1},height:0.5});
    this.imageName = 'environment';
    this.style = style;
    this.sheet = new Sheet('tile');
    this.variation = 0;
    this.march = 0;
    //if(Math.random() < 0.1) {
    //    this.variation = util.randomIntRange(2,3);
    //} else {
    //    this.variation = util.randomIntRange(0,1);
    //}
    var self = this;
    this.on('draw',function(canvas) { if(self.exists) canvas.drawEntity(self); });
}

Tile.prototype.getSprite = function() {
    var metrics = { 
        x: this.sheet.map[this.style][this.march].x, y: this.sheet.map[this.style][this.march].y,
        w: this.sheet.map[this.style][this.march].w, h: this.sheet.map[this.style][this.march].h,
        ox: this.sheet.map[this.style][this.march].ox, oy: this.sheet.map[this.style][this.march].oy
    };
    metrics.y += metrics.h * this.variation;
    return { metrics: metrics, image: this.imageName }
};