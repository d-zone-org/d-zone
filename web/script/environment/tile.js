'use strict';
var util = require('./../common/util.js');
var Sheet = require('./sheet2.js');

module.exports = Tile;

function Tile(options) {
    this.game = options.game;
    this.grid = options.grid;
    this.tileCode = options.tileCode;
    this.position = options.position;
    this.zDepth = this.position.x + this.position.y;
    this.screen = {
        x: (this.position.x - this.position.y) * 16 - 16,
        y: (this.position.x + this.position.y) * 8 - (this.position.z) * 16 - 8
    };
    this.imageName = 'static-tiles';
    this.sheet = new Sheet('tile');
    
    var spriteMap = this.sheet.map[this.tileCode];
    this.sprite = {
        metrics: {
            x: spriteMap.x, y: spriteMap.y,
            w: spriteMap.w, h: spriteMap.h,
            ox: spriteMap.ox, oy: spriteMap.oy
        },
        image: this.imageName, position: this.position, screen: this.screen
    };
    if(this.tileCode == 'G-G-G-G') {
        var variation = util.randomIntRange(0,2);
        var random = Math.random();
        if(Math.random() > 0.98) variation = 8;
        else if(Math.random() > 0.95) variation = util.randomIntRange(5,7);
        else if(random > 0.6) variation = util.randomIntRange(3,4);
        this.sprite.metrics.x += variation * this.sprite.metrics.w;
    }
}