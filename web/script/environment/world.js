'use strict';
var util = require('./../common/util.js');
var geometry = require('./../common/geometry.js');

var Tile = require('./tile.js');
var Block = require('./block.js');
var HalfBlock = require('./halfblock.js');

module.exports = World;

var Canvas = require('./../common/bettercanvas.js');
var testCanvas = new Canvas(100,50);
document.body.appendChild(testCanvas.canvas);

function World(game,worldSize) {
    this.game = game;
    this.game.world = this;
    this.worldSize = Math.floor(worldSize/2)*2; // Must be an even number
    this.worldRadius = Math.floor(worldSize/2);
    this.objects = {};
    // Grid-based map to hold world tiles
    this.map = {};
    console.log('generating world size',this.worldSize);
    
    var noiseBig = geometry.buildNoiseMap(this.worldRadius/3 + 1, this.worldRadius/3 + 1);
    var noiseSmall = geometry.buildNoiseMap(this.worldRadius/1.5 + 1,this.worldRadius/1.5 + 1);
    var bigBlur = (noiseBig.length - 1) / this.worldSize;
    var smallBlur = (noiseSmall.length - 1) / this.worldSize;
    this.mapBounds = { xl: 0, yl: 0, xh: 0, yh: 0 }; // TODO: Center canvas using this
    for(var tx = 0; tx < this.worldSize; tx++) for(var ty = 0; ty < this.worldSize; ty++) {
        var bigNoiseValue = geometry.getNoiseMapPoint(noiseBig, tx * bigBlur, ty * bigBlur);
        var smallNoiseValue = geometry.getNoiseMapPoint(noiseSmall, tx * smallBlur, ty * smallBlur);
        var noiseValue = (bigNoiseValue + smallNoiseValue*2) / 3;
        //var color = 'rgba(255,255,255,'+noiseValue+')'; // Draw debug noise map
        //testCanvas.fillRect(color, tx, ty, 1, 1);
        var grid;
        var x = (tx-this.worldRadius), y = (ty-this.worldRadius);
        var farness = (this.worldRadius - (Math.abs(x)+Math.abs(y))/2)/this.worldRadius;
        if(noiseValue/1.1 < farness) {
            this.mapBounds.xl = x < this.mapBounds.xl ? x : this.mapBounds.xl;
            this.mapBounds.yl = y < this.mapBounds.yl ? y : this.mapBounds.yl;
            this.mapBounds.xh = x > this.mapBounds.xh ? x : this.mapBounds.xh;
            this.mapBounds.yh = y > this.mapBounds.yh ? y : this.mapBounds.yh;
            var height = Math.round(noiseValue * (1/farness) * 6);
            grid = new HalfBlock('plain', x, y, height/2);
            grid.grid = x+':'+y;
            this.map[x+':'+y] = grid;
            grid.addToGame(game);
        }
    }
    this.crawlMap(); // Examine map to determine islands, border tiles, fix elevation, etc
    this.marchSquares(); // Examine neighbors to determine march bits
    console.log('Created world with',Object.keys(this.map).length,'tiles');
    // TODO: Retry if tile count is too high/low
}

World.prototype.crawlMap = function() {
    this.islands = [];
    var crawled = {};
    var thisIsland = 0;
    for(var x = this.mapBounds.xl; x <= this.mapBounds.xh; x++) {
        for(var y = this.mapBounds.yl; y <= this.mapBounds.yh; y++) {
            var currentTile = this.map[x+':'+y]; if(!currentTile) continue;
            // First ensure this tile is equal or lower than the neighbors behind it
            var lowestZ = 100;
            var nw = [this.map[x+':'+(y-1)],this.map[(x-1)+':'+y]];
            var goBack = false;
            for(var n = 0; n < nw.length; n++) { if(!nw[n]) continue;
                var allowance = Math.random() > 0.8 ? 0.5 : 0; // Chance of allowing a higher tile
                lowestZ = nw[n].position.z + allowance < lowestZ ?
                    nw[n].position.z + allowance : lowestZ;
            }
            var zDelta = lowestZ - currentTile.position.z;
            if(zDelta < 0) currentTile.move({x:0,y:0,z:zDelta},true);
            // Check if the neighbors behind are too high
            for(var n2 = 0; n2 < nw.length; n2++) { if(!nw[n2]) continue;
                if(nw[n2].position.z > currentTile.position.z + 0.5) {
                    zDelta = currentTile.position.z + 0.5 - nw[n2].position.z;
                    nw[n2].move({x:0,y:0,z:zDelta},true);
                    goBack = { x: +(nw[n2].grid.split(':')[0]), y: +(nw[n2].grid.split(':')[1]) };
                }
            }
            // If we adjusted a previous tile's height, we need to go back to it
            if(goBack) { x = goBack.x; y = goBack.y - 1; continue; }
            if(crawled[currentTile.grid]) continue; // Skip already-crawled tiles
            var neighborsToCrawl = [];
            while(true) { // Keep crawling outward until no neighbors are left
                crawled[currentTile.grid] = currentTile;
                if(this.islands[thisIsland]) this.islands[thisIsland].push(currentTile);
                    else this.islands.push([currentTile]);
                var currentNeighbors = geometry.getNeighbors(currentTile.grid);
                for(var nKey in currentNeighbors) { if (!currentNeighbors.hasOwnProperty(nKey)) continue;
                    var neighbor = this.map[currentNeighbors[nKey]];
                    if(!neighbor) {
                        currentTile.border = true;
                        continue;
                    }
                    if(!crawled[neighbor.grid]) {
                        neighborsToCrawl.push(neighbor);
                    }
                }
                var color = currentTile.border ? 'white' : // Draw debug map
                    ['red','blue','green','yellow','orange','purple','teal'][thisIsland];
                testCanvas.fillRect(color, +currentTile.grid.split(':')[0]+this.worldSize*1.5+2,
                    +currentTile.grid.split(':')[1]+this.worldSize/2+2, 1, 1);
                if(neighborsToCrawl.length > 0) {
                    currentTile = neighborsToCrawl.pop();
                } else { thisIsland++; break; } // No more neighbors, this island is done
            }
        }
    }
    this.mainIsland = 0;
    for(var i = 1; i < this.islands.length; i++) {
        this.mainIsland = this.islands[i].length > this.islands[this.mainIsland].length ? 
            i : this.mainIsland;
    }
    for(var i2 = 0; i2 < this.islands.length; i2++) { if(i2 == this.mainIsland) continue;
        for(var it = 0; it < this.islands[i2].length; it++) {
            delete this.map[this.islands[i2][it].grid];
            this.islands[i2][it].remove();
        }
    }
};

World.prototype.marchSquares = function() {
    for(var key in this.map) { if(!this.map.hasOwnProperty(key)) continue;
        if(!(this.map[key] instanceof Tile)) continue;
        var neighbors = geometry.getNeighbors(key);
        var w = this.map[neighbors.w], n = this.map[neighbors.n];
        w = w instanceof Tile ? 0 : 1;
        n = n instanceof Tile ? 0 : 1;
        this.map[key].setMarch(w | (n << 1));
    }
};

World.prototype.addToWorld = function(obj) {
    if(this.objects[obj.position.x]) {
        if(this.objects[obj.position.x][obj.position.y]) {
            if(this.objects[obj.position.x][obj.position.y][obj.position.z]) {
                return false;
            }
        } else {
            this.objects[obj.position.x][obj.position.y] = {}
        }
    } else {
        this.objects[obj.position.x] = {};
        this.objects[obj.position.x][obj.position.y] = {}
    }
    if(this.objects[obj.position.x][obj.position.y][obj.position.z]) console.log('no no no no!!');
    this.objects[obj.position.x][obj.position.y][obj.position.z] = obj;
    return true;
};

World.prototype.moveObject = function(obj,x1,y1,z1,x2,y2,z2) {
    delete this.objects[x1][y1][z1];
    obj.position.x = x2;
    obj.position.y = y2;
    obj.position.z = z2;
    this.addToWorld(obj)
};

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
    return this.map[x+':'+y];
};

World.prototype.randomEmptyGrid = function() {
    var safety = 0;
    do {
        var grid = this.randomGrid();
        var unoccupied = !this.objectAtXYZ(grid.position.x,grid.position.y,grid.position.z);
        safety++;
    }
    while(safety < 1000 && !unoccupied);
    return grid;
};

World.prototype.objectAtXYZ = function(x,y,z) {
    if(!this.objects[x]) return false;
    if(!this.objects[x][y]) return false;
    return this.objects[x][y][z];
};

World.prototype.objectUnderXYZ = function(x,y,z) {
    if(!this.objects[x]) return false;
    if(!this.objects[x][y]) return false;
    var highest = -1000;
    for(var zKey in this.objects[x][y]) { if(!this.objects[x][y].hasOwnProperty(zKey)) continue;
        if(+zKey > z) continue;
        highest = +zKey > highest ? +zKey : highest;
    }
    return this.objects[x][y][highest];
};