'use strict';
var util = require('dz-util');
var geometry = require('geometry');
var Map2D = require('map2d');
var config = require('./config');

const TILES = {
    'EMPTY':   0,
    'SLAB':    1,
    'GRASS':   2,
    'FLOWERS': 3
};

function generateTileMap(size) {
    // World size must be an even number between 10 and 2048
    var worldSize = Math.max(10, Math.min(2048, Math.floor(size * config().sizeFactor / 2) * 2)); 
    var worldRadius = Math.floor(worldSize / 2);
    // Tile data is stored in a flattened, 2D, 8-bit unsigned integer array
    var tileMap = new Map2D(Uint8Array, worldSize);
    
    var noiseBig = geometry.buildNoiseMap(worldRadius / 3 + 1, worldRadius / 3 + 1);
    var noiseSmall = geometry.buildNoiseMap(worldRadius / 1.5 + 1, worldRadius / 1.5 + 1);
    var bigBlur = (noiseBig.width - 1) / worldSize;
    var smallBlur = (noiseSmall.width - 1) / worldSize;
    var tileValues = []; // Store tile likelihood values
    var tileValueSamples = []; // For faster sorting when determining median
    
    for(var tx = 0; tx < worldSize; tx++) for(var ty = 0; ty < worldSize; ty++) {
        var bigNoiseValue = geometry.getNoiseMapPoint(noiseBig, tx * bigBlur, ty * bigBlur);
        var smallNoiseValue = geometry.getNoiseMapPoint(noiseSmall, tx * smallBlur, ty * smallBlur);
        var noiseValue = (bigNoiseValue + smallNoiseValue * 2) / 3;
        var cx = Math.abs(tx - worldRadius),
            cy = Math.abs(ty - worldRadius);
        var nearness = (worldRadius - Math.max(cx, cy)) / worldRadius;
        var tileLikelihood = noiseValue - nearness * config().centeredness;
        tileValues.push(tileLikelihood);
        if(!(tx % 4 && ty % 4)) tileValueSamples.push(tileLikelihood);
    }
    var median = tileValueSamples.sort()[Math.ceil(tileValueSamples.length * config().density) - 1];
    for(var ft = 0; ft < tileValues.length; ft++) {
        if(tileValues[ft] <= median) { // 50% of the map will be tiles (before island removal)
            tileMap.setIndex(ft, TILES.GRASS);
        }
    }
    return { tiles: tileMap, radius: worldRadius, size: worldSize };
}

function crawlMap(map) {
    var islands = [], tilesCrawled = [], neighborsToCrawl, thisIsland = 0;
    map.tiles.forEachTile(function(val, index) {
        if(!val || tilesCrawled[index]) return; // Skip blank or already crawled
        neighborsToCrawl = [index];
        while(true) { // Keep crawling outward until no neighbors are left
            let currentIndex = neighborsToCrawl.pop();
            let currentVal = map.tiles.getIndex(currentIndex);
            tilesCrawled[currentIndex] = true;
            if(islands[thisIsland]) islands[thisIsland].push(currentIndex);
            else islands.push([currentIndex]);
            let { x, y } = map.tiles.XYFromIndex(currentIndex);
            map.tiles.forEachNeighborExtended(x, y, function(nx, ny, nVal, nTileIndex, nIndex) {
                if(!nVal) { // If neighbor doesn't exist, set current tile to slab and move on
                    if(currentVal != TILES.SLAB) map.tiles.setIndex(currentIndex, TILES.SLAB);
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
    if(config().removeIslands) for(i = 0; i < islands.length; i++) { 
        if(i == mainIsland) continue;
        for(var it = 0; it < islands[i].length; it++) {
            map.tiles.setIndex(islands[i][it], 0);
        }
    }
    // Find land tile closest to center to place beacon
    var { x: beaconX, y: beaconY } = map.tiles.traverseSpiral(map.radius, map.radius, (val) => { return val; });
    map.tiles.setXY(beaconX, beaconY, TILES.SLAB);
    map.tiles.forEachNeighbor(beaconX, beaconY, function(nx, ny, nVal, nIndex) {
        map.tiles.setIndex(nIndex, TILES.SLAB);
    });
    map.beacon = { x: beaconX - map.radius, y: beaconY - map.radius };
}

function createFlowerPatches(map) {
    var numPatches = Math.ceil(Math.pow(map.radius, 2) / 80 * config().flowerPatchesFactor);
    var validTiles = map.tiles.getTiles([TILES.GRASS]);
    for(var fp = 0; fp < numPatches; fp++) {
        var attempt = 0, limit = Math.pow(map.radius, 2);
        do {
            if(!validTiles.length) { // No valid tiles left to grow flowers
                attempt = limit;
                break;
            }
            var valid = false;
            var tileIndex = util.pickInArray(validTiles);
            var { x: tileX, y: tileY } = map.tiles.XYFromIndex(tileIndex);
            valid = map.tiles.checkNeighborsExtended(tileX, tileY, [TILES.GRASS, TILES.FLOWERS]);
            attempt++;
        } while(attempt < limit && !valid);
        if(attempt == limit) continue;
        map.tiles.setIndex(tileIndex, TILES.FLOWERS);
        var spread = util.random(2, 5);
        for(var s = 0; s < spread; s++) {
            var spreadX = tileX + util.random(-1, 1),
                spreadY = tileY + util.random(-1, 1);
            var spreadIndex = map.tiles.indexFromXY(spreadX, spreadY);
            util.removeFromArray(spreadIndex, validTiles);
            if(map.tiles.getXY(spreadX, spreadY) === TILES.FLOWERS) continue;
            if(map.tiles.checkNeighborsExtended(spreadX, spreadY, [TILES.GRASS, TILES.FLOWERS])) {
                map.tiles.setXY(spreadX, spreadY, TILES.FLOWERS);
            }
        }
    }
}

module.exports = {
    generateMap(size) {
        var world = generateTileMap(size); // Generate 2d map of tiles using perlin noise
        crawlMap(world); // Examine map to detect islands, borders, etc
        createFlowerPatches(world);
        //world.tiles.print('world');
        return world;
    }
};