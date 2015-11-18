'use strict';
var inherits = require('inherits');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

module.exports = Tile;
inherits(Tile, WorldObject);

function Tile(style,x,y,z) {
    WorldObject.call(this, {position:{x:x,y:y,z:z},pixelSize:{x:16,y:16,z:1},height:0});
    this.style = style;
    this.sheet = new Sheet('tile');
    if(Math.random() < 0.1) {
        this.variation = util.randomIntRange(2,3);
    } else {
        this.variation = util.randomIntRange(0,1);
    }
    var self = this;
    this.on('draw',function(canvas) { if(self.exists) canvas.drawImageIso(self); });
}

Tile.prototype.getSprite = function() {
    var metrics = JSON.parse(JSON.stringify(this.sheet.map[this.style]));
    metrics.y += metrics.h * this.variation;
    return {
        metrics: metrics,
        image: this.sheet.getSprite()
    }
};

Tile.prototype.setMarch = function(march) {
    this.sheet.map[this.style].x += march * this.sheet.map[this.style].w;
};