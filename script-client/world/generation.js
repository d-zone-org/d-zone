'use strict';
var util = require('dz-util');
var geometry = require('geometry');
var Map2D = require('map2d');
var Map3D = require('map3d');

const TILES = {
    'EMPTY':   0,
    'SLAB':    1,
    'GRASS':   2,
    'FLOWERS': 3
};

function generateTileMap(size) {
    var worldSize = Math.max(4,Math.floor(size/2)*2); // Must be an even number >= 24
    var worldRadius = Math.floor(worldSize/2);
    // Tile data is stored in a flattened, 2D, 8-bit unsigned integer array
    var tileMap = new Map2D(Uint8Array,worldSize,worldSize);
    
    var noiseBig = geometry.buildNoiseMap(worldRadius/3 + 1, worldRadius/3 + 1);
    var noiseSmall = geometry.buildNoiseMap(worldRadius/1.5 + 1,worldRadius/1.5 + 1);
    var bigBlur = (noiseBig.width - 1) / worldSize;
    var smallBlur = (noiseSmall.width - 1) / worldSize;
    var tileValues = []; // Store tile likelihood values to determine median
    
    for(var tx = 0; tx < worldSize; tx++) for(var ty = 0; ty < worldSize; ty++) {
        var bigNoiseValue = geometry.getNoiseMapPoint(noiseBig, tx * bigBlur, ty * bigBlur);
        var smallNoiseValue = geometry.getNoiseMapPoint(noiseSmall, tx * smallBlur, ty * smallBlur);
        var noiseValue = (bigNoiseValue + smallNoiseValue*2) / 3;
        var cx = Math.abs(tx - worldRadius),
            cy = Math.abs(ty - worldRadius);
        var nearness = (worldRadius - Math.max(cx,cy))/worldRadius;
        tileValues.push(noiseValue/256 - nearness); // Tile likelihood
    }
    var sortedTileValues = tileValues.slice(0).sort();
    var median = sortedTileValues[tileValues.length/2]; // Median of likelihood
    for(var ft = 0; ft < tileValues.length; ft++) {
        if(tileValues[ft] < median) { // 50% of the map will be tiles (before island removal)
            tileMap.setIndex(ft,TILES.GRASS);
        }
    }
    return { tiles: tileMap, radius: worldRadius, size: worldSize };
}

function crawlMap(map) {
    var islands = [], tilesCrawled = [], neighborsToCrawl, thisIsland = 0;
    map.tiles.forEachTile(function(val,index,arr) {
        if(!val || tilesCrawled[index]) return; // Skip blank or already crawled
        neighborsToCrawl = [index];
        while(true) { // Keep crawling outward until no neighbors are left
            var currentIndex = neighborsToCrawl.pop();
            var currentVal = map.tiles.getIndex(currentIndex);
            tilesCrawled[currentIndex] = true;
            if(islands[thisIsland]) islands[thisIsland].push(currentIndex);
            else islands.push([currentIndex]);
            var coords = map.tiles.XYFromIndex(currentIndex);
            map.tiles.forEachNeighborExtended(coords.x,coords.y,function(nx,ny,nVal,nTileIndex,nIndex) {
                if(!nVal) { // If neighbor doesn't exist, set current tile to slab and move on
                    if(currentVal != TILES.SLAB) map.tiles.setIndex(currentIndex,TILES.SLAB);
                    return;
                }
                // If tile is immediate neighbor and not already crawled, add it to crawl list
                if(nIndex < 4 && !tilesCrawled[nTileIndex]) neighborsToCrawl.push(nTileIndex);
            });
            if(neighborsToCrawl.length == 0) { // No more neighbors, this island is done
                thisIsland++; 
                break; 
            }
        }
    });
    var mainIsland = 0, i;
    // Determine largest island
    for(i = 1; i < islands.length; i++) {
        mainIsland = islands[i].length > islands[mainIsland].length ? i : mainIsland;
    }
    // Delete tiles in all other islands
    for(i = 0; i < islands.length; i++) { 
        if(i == mainIsland) continue;
        for(var it = 0; it < islands[i].length; it++) {
            map.tiles.setIndex(islands[i][it],0);
        }
    }
    map.tiles.setXY(map.radius,map.radius,TILES.SLAB); // Slabs around beacon
    map.tiles.forEachNeighbor(map.radius,map.radius,function(nx,ny,nVal,nIndex) {
        map.tiles.setIndex(nIndex,TILES.SLAB);
    });
}

function createFlowerPatches(map) {
    var numPatches = Math.ceil(Math.pow(map.radius,2) / 80);
    for(var fp = 0; fp < numPatches; fp++) {
        var attempt = 0, limit = Math.pow(map.radius,2);
        do {
            var valid = false;
            var tile = map.tiles.getRandomTile(TILES.GRASS);
            valid = map.tiles.checkNeighborsExtended(tile.x,tile.y,[TILES.GRASS,TILES.FLOWERS]);
            attempt++;
        } while(attempt < limit && !valid);
        if(attempt == limit) continue;
        map.tiles.setIndex(tile.index,TILES.FLOWERS);
        var spread = util.randomIntRange(2,5);
        for(var s = 0; s < spread; s++) {
            var spreadX = tile.x + util.randomIntRange(-1,1),
                spreadY = tile.y + util.randomIntRange(-1,1);
            if(map.tiles.getXY(spreadX,spreadY) == TILES.FLOWERS) continue;
            if(map.tiles.checkNeighborsExtended(spreadX,spreadY,[TILES.GRASS,TILES.FLOWERS])) {
                map.tiles.setXY(spreadX,spreadY,TILES.FLOWERS);
            }
        }
    }
}

module.exports = {
    generateMap: function(size) {
        var map = generateTileMap(size); // Generate 2d map of tiles using perlin noise
        crawlMap(map); // Examine map to detect islands, borders, etc
        createFlowerPatches(map);
        // map.tiles.print('world');
        map.entityMap = new Map3D(map.size,map.size);
        return map;
    }
};