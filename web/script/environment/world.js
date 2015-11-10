'use strict';
var util = require('./../common/util.js');

var Tile = require('./tile.js');
var Block = require('./block.js');
var HalfBlock = require('./halfblock.js');

module.exports = World;

function World(game,gridSize,worldSize) {
    this.game = game;
    this.gridSize = gridSize;
    this.worldSize = worldSize;
    this.worldRadius = Math.floor(worldSize/2);
    
    // Grid-based map to hold world tiles
    this.map = {};
    
    var maxRadius = Math.pow(this.worldRadius,2) + 15;
    for(var tx = 0; tx < worldSize; tx++) for(var ty = 0; ty < worldSize; ty++) {
        var x = tx-this.worldRadius, y = ty-this.worldRadius;
        var radius = x*x+y*y;
        if(radius > maxRadius) continue;
        var grid;
        if(radius < 64 && Math.random() < (80 - radius)/70) {
            grid = new Tile(x*gridSize,y*gridSize,0);
            //if(Math.random() < 0.1) {
            //    var actor = new Actor(x*gridSize,y*gridSize,grid.size.z);
            //    actor.addToGame(game);
            //}
        } else {
            grid = Math.random() < (radius - 64) / 15 ?
                new Block(x*gridSize,y*gridSize,0) : new HalfBlock(x*gridSize,y*gridSize,0);
        }
        this.map[x+':'+y] = grid;
        grid.addToGame(game);
    }
    console.log('Created world with',util.countProperties(this.map),'tiles');
}

World.prototype.randomGrid = function() {
    var self = this;
    function randomRange() { return util.randomIntRange(self.worldRadius*-1-1,self.worldRadius-1); }
    var x = randomRange(), y = randomRange();
    while(!this.map[x+':'+y]) {
        x = randomRange();
        y = randomRange();
    }
    return { x: x, y: y };
};

World.prototype.randomEmptyGrid = function() {
    var grid = this.randomGrid();
    var safety = 0;
    while(safety < 1000 && this.map[grid.x+':'+grid.y].size.z > 1) {
        grid = this.randomGrid();
        safety++;
    }
    return grid;
};