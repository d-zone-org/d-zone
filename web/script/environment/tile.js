'use strict';
var util = require('./../common/util.js');
var Sheet = require('./sheet2.js');

module.exports = Tile;

function Tile(options) {
    this.game = options.game;
    this.grid = options.grid;
    this.tileCode = options.tileCode;
    this.position = options.position;
    this.position.fakeZ = -0.5;
    this.zDepth = options.zDepth;
    this.screen = {
        x: (this.position.x - this.position.y) * 16 - 16,
        y: (this.position.x + this.position.y) * 8 - (this.position.z) * 16 - 8
    };
    this.imageName = 'environment2';
    this.sheet = new Sheet('tile');
    //if(Math.random() < 0.1) {
    //    this.variation = util.randomIntRange(2,3);
    //} else {
    //    this.variation = util.randomIntRange(0,1);
    //}
    
    // TODO: For all objects, just add their sprite property (which is an object) to the zBuffer
    // The sprite image and metrics can be updated in the object, 
    // and the zBuffer will be updated since it holds a reference to that object
    // This will make it easier to have multi-sprite objects, such as these special tiles
    // Store screen coordinates in this object as well
    // No more "getSprite" necessary
    
    var spriteMap = this.sheet.map[this.tileCode];
    var zDepth = this.zDepth;
    if(spriteMap.constructor !== Array) {
        spriteMap = [spriteMap];
        zDepth = [zDepth]
    }
    for(var i = 0; i < spriteMap.length; i++) {
        this.game.renderer.addToZBuffer({
            metrics: {
                x: spriteMap[i].x, y: spriteMap[i].y,
                w: spriteMap[i].w, h: spriteMap[i].h,
                ox: spriteMap[i].ox, oy: spriteMap[i].oy
            },
            image: this.imageName, position: this.position, screen: this.screen
        }, zDepth[i]);
    }
}