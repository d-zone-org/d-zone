'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var util = require('./../common/util.js');
var Sheet = require('./sheet2.js');
module.exports = Tile;
inherits(Tile, EventEmitter);

function Tile(options) {
    this.game = options.game;
    this.grid = options.grid;
    this.tileCode = options.tileCode;
    this.position = options.position;
    this.zDepth = options.zDepth;
    //this.position.x -= this.position.z*0.5;
    //this.position.y -= this.position.z*0.5;
    this.fakeZ = -0.5;
    this.screen = {
        x: (this.position.x - this.position.y) * 16 - 16,
        y: (this.position.x + this.position.y) * 8 - (this.position.z) * 16 - 8
    };
    this.height = 0;
    this.imageName = 'environment2';
    this.sheet = new Sheet('tile');
    //if(Math.random() < 0.1) {
    //    this.variation = util.randomIntRange(2,3);
    //} else {
    //    this.variation = util.randomIntRange(0,1);
    //}
    this.sprite = {
        metrics: {
            x: this.sheet.map[this.tileCode].x, y: this.sheet.map[this.tileCode].y,
            w: this.sheet.map[this.tileCode].w, h: this.sheet.map[this.tileCode].h,
            ox: this.sheet.map[this.tileCode].ox, oy: this.sheet.map[this.tileCode].oy
        },
        image: this.imageName
    };
    this.game.renderer.addToZBuffer(this, this.zDepth);
    var self = this;
    this.on('draw',function(canvas) { canvas.drawEntity(self); });
}

Tile.prototype.getSprite = function() {
    return this.sprite
};