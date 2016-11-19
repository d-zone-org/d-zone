'use strict';
var util = require('./../common/util.js');
var geometry = require('./../common/geometry.js');
var Pathfinder = require('./../actors/pathfinder.js');
var Slab = require('./slab.js');
var Tile = require('./tile.js');
var TileSheet = require('./sheet2.js');

module.exports = World;

var Canvas = require('./../common/bettercanvas.js');
var testCanvas = new Canvas(200,100);
var unoccupiedGrids; // For faster actor placement on init
//document.body.appendChild(testCanvas.canvas);

function World(game,worldSize) {
    this.game = game;
    this.game.world = this;
    this.worldSize = Math.max(24,Math.floor(worldSize/2)*2); // Must be an even number >= 24
    //this.worldSize = Math.max(12,Math.floor(worldSize/2)*2); // Must be an even number >= 24
    this.worldRadius = Math.floor(this.worldSize/2);
    this.objects = {};
    this.map = {}; // Grid-based map to hold world tiles
    this.walkable = {}; // Grid-based map to hold walkable surfaces
    
    // TODO: Move world generation into a new module
    
    geometry.generateClosestGrids(this.worldSize);
    
    testCanvas.clear();
    
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
            this.mapBounds.xl = Math.min(x,this.mapBounds.xl);
            this.mapBounds.yl = Math.min(y,this.mapBounds.yl);
            this.mapBounds.xh = Math.max(x,this.mapBounds.xh);
            this.mapBounds.yh = Math.max(y,this.mapBounds.yh);
            grid = new Slab('grass', x, y, -0.5);
            grid.grid = x+':'+y;
            this.map[x+':'+y] = grid;
            grid.addToGame(game);
        }
    }
    this.staticMap = [];
    this.crawlMap(); // Examine map to determine islands, borders, etc
    this.createTiles(); // Create map tiles from grid intersections
    
    var lowestScreenX = 0, lowestScreenY = 0, highestScreenX = 0, highestScreenY = 0;
    for(var i = 0; i < this.staticMap.length; i++) {
        var preTile = this.staticMap[i];
        var preScreen = { x: preTile.screen.x, y: preTile.screen.y };
        preScreen.x += preTile.sprite.metrics.ox || 0;
        preScreen.y += preTile.sprite.metrics.oy || 0;
        lowestScreenX = lowestScreenX < preScreen.x ? lowestScreenX : preScreen.x;
        lowestScreenY = lowestScreenY < preScreen.y ? lowestScreenY : preScreen.y;
        highestScreenX = highestScreenX > preScreen.x ? highestScreenX : preScreen.x;
        highestScreenY = highestScreenY > preScreen.y ? highestScreenY : preScreen.y;
    }
    var bgCanvas = new Canvas(
        (highestScreenX - lowestScreenX) + 32 + 1, (highestScreenY - lowestScreenY) + 32 + 9
    );
    for(var j = 0; j < this.staticMap.length; j++) {
        var tile = this.staticMap[j];
        var screen = { x: tile.screen.x, y: tile.screen.y };
        screen.x += tile.sprite.metrics.ox || 0;
        screen.y += tile.sprite.metrics.oy || 0;
        screen.x -= lowestScreenX;
        screen.y -= lowestScreenY;
        bgCanvas.drawImage(
            this.game.renderer.images[tile.sprite.image], tile.sprite.metrics.x, tile.sprite.metrics.y,
            tile.sprite.metrics.w, tile.sprite.metrics.h,
            Math.round(screen.x), Math.round(screen.y), tile.sprite.metrics.w, tile.sprite.metrics.h
        );
    }
    //bgCanvas.context.globalCompositeOperation = 'color';
    //bgCanvas.fill('rgba(30,30,50,0.7)');
    this.game.renderer.bgCanvas = {
        x: lowestScreenX, y: lowestScreenY, image: bgCanvas.canvas
    };
    Pathfinder.loadMap(this.walkable);
    unoccupiedGrids = Object.keys(this.map);
    unoccupiedGrids.splice(unoccupiedGrids.indexOf('0:0'), 1); // 0,0 is taken by beacon
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
            if(crawled[currentTile.grid]) continue; // Skip already-crawled tiles
            var neighborsToCrawl = [];
            while(true) { // Keep crawling outward until no neighbors are left
                crawled[currentTile.grid] = currentTile;
                if(this.islands[thisIsland]) this.islands[thisIsland].push(currentTile);
                    else this.islands.push([currentTile]);
                var currentNeighbors = geometry.getNeighbors(currentTile.grid);
                currentNeighbors = geometry.getNeighbors(currentTile.grid);
                for(var iKey in currentNeighbors) { if (!currentNeighbors.hasOwnProperty(iKey)) continue;
                    var neighbor = this.map[currentNeighbors[iKey]];
                    if(!neighbor) { currentTile.border = true; continue; }
                    if(!crawled[neighbor.grid]) neighborsToCrawl.push(neighbor);
                }
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
    // Set border tiles to slab
    for(var gKey in this.map) { if(!this.map.hasOwnProperty(gKey)) continue;
        var finalTile = this.map[gKey];
        if(finalTile.border) {
            finalTile.style = 'plain';
        } else {
            var finalNeighbors = geometry.get8Neighbors(finalTile.grid);
            for(var nKey in finalNeighbors) { if (!finalNeighbors.hasOwnProperty(nKey)) continue;
                if(!this.map[finalNeighbors[nKey]]) {
                    finalTile.style = 'plain';
                    break;
                }
            }
        }
    }
    this.map['0:0'].style = 'plain'; // Slab around beacon
    this.map['1:0'].style = 'plain';
    this.map['-1:0'].style = 'plain';
    this.map['0:1'].style = 'plain';
    this.map['0:-1'].style = 'plain';
    
    // Create flower patches
    for(var fp = 0; fp < Math.ceil(Math.pow(this.worldRadius,2) / 80); fp++) {
        var safety = 0;
        do {
            var valid = true;
            var grid = this.map[util.pickInObject(this.map)];
            var flowerNeighbors = geometry.get8Neighbors(grid.grid);
            for(var fKey in flowerNeighbors) { if (!flowerNeighbors.hasOwnProperty(fKey)) continue;
                var fNeighbor = this.map[flowerNeighbors[fKey]];
                if(!fNeighbor || fNeighbor.style != 'grass') {
                    valid = false;
                    break;
                }
            }
            safety++;
        } while(safety < 1000 && (grid.style != 'grass' || !valid));
        if(safety == 1000) continue;
        grid.style = 'flowers';
        var spread = util.randomIntRange(1,4);
        for(var s = 0; s < spread; s++) {
            var canSpread = true;
            var spreadX = grid.position.x+util.randomIntRange(-1,1), 
                spreadY = grid.position.y+util.randomIntRange(-1,1);
            var spreadGrid = this.map[spreadX+':'+spreadY];
            var spreadNeighbors = geometry.get8Neighbors(spreadGrid.grid);
            for(var sKey in spreadNeighbors) { if (!spreadNeighbors.hasOwnProperty(sKey)) continue;
                var sNeighbor = this.map[spreadNeighbors[sKey]];
                if(!sNeighbor || (sNeighbor.style != 'grass' && sNeighbor.style != 'flowers')) {
                    canSpread = false;
                    break;
                }
            }
            if(canSpread) spreadGrid.style = 'flowers';
        }
    }
};

World.prototype.createTiles = function() {
    // Tile types:
    //   Grass     G
    //   Slab      S
    //   Flowers   F
    //   Empty     E
    // Tile code constructed as NW-NE-SE-SW (eg. "S-X-X-B")

    this.tileMap = {};
    var self = this;
    
    function tileType(grid) { return self.map[grid].style[0].replace(/p/,'s').toUpperCase(); }
    
    function getTileCode(oGrid, nGrid) {
        if(oGrid == nGrid) return tileType(oGrid);
        var neighbor = self.map[nGrid];
        if(!neighbor) return 'E';
        return tileType(nGrid);
    }
    
    function generateTile(oGrid, tile, grid, game) {
        var nGrids = tile.grids;
        var tileCode = getTileCode(oGrid,nGrids[0])+'-'+getTileCode(oGrid,nGrids[1])
            +'-'+getTileCode(oGrid,nGrids[2])+'-'+getTileCode(oGrid,nGrids[3]);
        var tileSprite = (new TileSheet('tile')).map[tileCode];
        if(!tileSprite) console.error('unknown tile code',tileCode,nGrids);
        return {
            tileCode: tileCode, position: tile, grid: grid, game: game
        };
    }
    
    for(var key in this.map) { if(!this.map.hasOwnProperty(key)) continue;
        var x = +key.split(':')[0], y = +key.split(':')[1], z = this.map[key].position.z;
        var neighbors = geometry.get8Neighbors(key);
        var nw = { x: x-0.5, y: y-0.5, z: z, grids: [neighbors.nw, neighbors.n, key, neighbors.w] }, 
            ne = { x: x+0.5, y: y-0.5, z: z, grids: [neighbors.n, neighbors.ne, neighbors.e, key] },
            se = { x: x+0.5, y: y+0.5, z: z, grids: [key, neighbors.e, neighbors.se, neighbors.s] }, 
            sw = { x: x-0.5, y: y+0.5, z: z, grids: [neighbors.w, key, neighbors.s, neighbors.sw] };
        var tiles = [nw,ne,se,sw];
        for(var i = 0; i < tiles.length; i++) {
            var tileGrid = z+':'+tiles[i].x+':'+tiles[i].y;
            if(this.tileMap[tileGrid]) continue;
            this.tileMap[tileGrid] = new Tile(generateTile(key, tiles[i], tileGrid, this.game));
            this.staticMap.push(this.tileMap[tileGrid]);
        }
    }
    this.staticMap.sort(function(a,b) { return a.zDepth - b.zDepth; });
};

World.prototype.addToWorld = function(obj) {
    //console.log('world: adding object at',obj.position.x,obj.position.y,obj.position.z);
    if(this.objects[obj.position.x]) {
        if(this.objects[obj.position.x][obj.position.y]) {
            if(this.objects[obj.position.x][obj.position.y][obj.position.z]) {
                console.error('occupado!',obj.position.x,obj.position.y,obj.position.z,
                    obj,this.objects[obj.position.x][obj.position.y][obj.position.z]);
                return false;
            }
        } else {
            this.objects[obj.position.x][obj.position.y] = {};
        }
    } else {
        this.objects[obj.position.x] = {};
        this.objects[obj.position.x][obj.position.y] = {};
    }
    this.objects[obj.position.x][obj.position.y][obj.position.z] = obj;
    this.updateWalkable(obj.position.x, obj.position.y);
};

World.prototype.removeFromWorld = function(obj) {
    //console.log('world: removing object at',obj.position.x,obj.position.y,obj.position.z);
    delete this.objects[obj.position.x][obj.position.y][obj.position.z];
    this.updateWalkable(obj.position.x, obj.position.y);
};

World.prototype.moveObject = function(obj,x,y,z) {
    //console.log('world: moving object from',obj.position.x,obj.position.y,obj.position.z,'to',x,y,z);
    this.removeFromWorld(obj);
    obj.position.x = x; obj.position.y = y; obj.position.z = z;
    this.addToWorld(obj)
};

World.prototype.updateWalkable = function(x, y) {
    //console.log('world: updating walkable at',x,y);
    var objects = this.objects[x][y];
    if(!objects || Object.keys(objects).length == 0) {
        delete this.walkable[x+':'+y];
        //console.log('world: ',x,y,'is now unwalkable');
        return;
    }
    var zKeys = Object.keys(objects).sort(function(a, b) { return a - b; });
    var topObject = objects[zKeys[zKeys.length-1]];
    if(topObject.unWalkable) {
        delete this.walkable[x+':'+y];
        //console.log('world: ',x,y,'is now unwalkable');
    } else {
        this.walkable[x+':'+y] = topObject.position.z + topObject.height;
        //console.log('world: ',x,y,'is now walkable',this.walkable[x+':'+y]);
    }
};

World.prototype.randomEmptyGrid = function() {
    return unoccupiedGrids.splice(util.randomIntRange(0, unoccupiedGrids.length - 1), 1)[0];
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

World.prototype.findObject = function(obj) { // For debugging
    for(var xKey in this.objects) { if (!this.objects.hasOwnProperty(xKey)) continue;
        var xObjects = this.objects[xKey];
        for(var yKey in xObjects) { if (!xObjects.hasOwnProperty(yKey)) continue;
            var yObjects = xObjects[yKey];
            for(var zKey in yObjects) { if (!yObjects.hasOwnProperty(zKey)) continue;
                if(obj === yObjects[zKey]) return [xKey,yKey,zKey];
            }
        }
    }
};