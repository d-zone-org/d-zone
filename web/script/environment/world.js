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
            grid = new Tile('grass',x*gridSize,y*gridSize,0);
            //if(Math.random() < 0.1) {
            //    var actor = new Actor(x*gridSize,y*gridSize,grid.size.z);
            //    actor.addToGame(game);
            //}
        } else {
            grid = Math.random() < (radius - 64) / 15 ?
                new Block('plain',x*gridSize,y*gridSize,0) : new HalfBlock('plain',x*gridSize,y*gridSize,0);
        }
        this.map[x+':'+y] = grid;
        grid.addToGame(game);
    }
    console.log('Created world with',util.countProperties(this.map),'tiles');
}

World.prototype.randomGrid = function() {
    var self = this;
    function randomRange() { 
        return util.randomIntRange(self.worldRadius*-1,self.worldRadius); 
    }
    var x = randomRange(), y = randomRange();
    while(!this.map[x+':'+y]) {
        x = randomRange();
        y = randomRange();
    }
    return { x: x, y: y };
};

World.prototype.randomEmptyGrid = function(obj) {
    var self = this;
    function buildTestObject(grid) {
        return {
            position: {
                x: grid.x * self.gridSize,
                y: grid.y * self.gridSize,
                z: self.map[grid.x+':'+grid.y].size.z
            },
            size: { x: obj.size.x, y: obj.size.y, z: obj.size.z }
        }
    }
    var safety = 0;
    do {
        var grid = this.randomGrid();
        var testObj = obj ? buildTestObject(grid) : null;
        var unoccupied = testObj ? !this.checkCollision(testObj) : true;
        safety++;
    }
    while(safety < 1000 && (this.map[grid.x+':'+grid.y].size.z > 1 || !unoccupied));
    return grid;
};

World.prototype.checkCollision = function(obj) {
    for(var i = 0; i < this.game.entities.length; i++) {
        if(this.game.entities[i].hasOwnProperty('variation')) continue; // Skip environment tiles
        if(!this.game.entities[i].size || obj === this.game.entities[i]) continue;
        if(this.game.entities[i].overlaps(obj)) return true;
    }
    return false;
};