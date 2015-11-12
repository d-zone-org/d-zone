'use strict';
var inherits = require('inherits');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

module.exports = Tile;
inherits(Tile, WorldObject);

function Tile(style,x,y,z) {
    WorldObject.call(this, {position:{x:x,y:y,z:z},size:{x:16,y:16,z:1}});
    var self = this;
    this.style = style;
    this.sheet = new Sheet('tile');
    if(Math.random() < 0.1) {
        this.variation = util.randomIntRange(2,3);
    } else {
        this.variation = util.randomIntRange(0,1);
    }
    this.on('draw',function(canvas) { canvas.drawImageIso(self); });
}

Tile.prototype.getSprite = function() {
    return {
        metrics: this.sheet.map[this.style][this.variation],
        image: this.sheet.getSprite()
    }
};

Tile.prototype.setMarch = function(march) {
    this.sheet.map[this.style][this.variation].x += march * this.sheet.map[this.style][this.variation].w;
};