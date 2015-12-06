'use strict';
var util = require('./../common/util.js');
var Sheet = require('./sheet2.js');

module.exports = Tile;

function Tile(options) {
    this.game = options.game;
    this.grid = options.grid;
    this.tileCode = options.tileCode;
    this.position = options.position;
    this.zDepth = options.zDepth;
    this.screen = {
        x: (this.position.x - this.position.y) * 16 - 16,
        y: (this.position.x + this.position.y) * 8 - (this.position.z) * 16 - 8
    };
    this.imageName = 'static-tiles';
    this.sheet = new Sheet('tile');
    //if(Math.random() < 0.1) {
    //    this.variation = util.randomIntRange(2,3);
    //} else {
    //    this.variation = util.randomIntRange(0,1);
    //}

    var spriteMap = this.sheet.map[this.tileCode];
    this.sprite = {
        metrics: {
            x: spriteMap.x, y: spriteMap.y,
            w: spriteMap.w, h: spriteMap.h,
            ox: spriteMap.ox, oy: spriteMap.oy
        },
        image: this.imageName, position: this.position, screen: this.screen
    };
}