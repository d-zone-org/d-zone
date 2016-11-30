'use strict';
var Map3D = require('map3d');

var map = new Map3D(Uint8Array, 0, 0, 0);

module.exports = {
    init(w, h, d, tiles) {
        map.width = w;
        map.height = h;
        map.depth = d;
        map.area = w * h;
        map.dataArray = new map.dataArray.constructor(map.area * d);
        map.buffer = map.dataArray.buffer;
        map.forEachTileAtZ(0, function(tile, index, tileArray){
            tileArray[index] = tiles.getIndex(index) ? 1 : 0; // Create platforms for map tiles
        }, true);
    },
    getFreePlatform(x, y, z, maxDown, maxUp) {
        var closest = -100;
        for(var i = Math.max(0, z - maxDown); i <= Math.min(63, z + maxUp); i++) {
            if(isFreePlatform(x, y, i)) {
                if(i === z) return z; // Same Z preferred
                if(Math.abs(i - closest) >= Math.abs(i - z)) closest = i; // Get closest Z
            }
        }
        return closest;
    },
    makeSolid(x, y, z) { map.bitOrXYZ(x, y, z, 2); },
    removeSolid(x, y, z) { map.bitNotXYZ(x, y, z, 2); },
    makePlatform(x, y, z) { map.bitOrXYZ(x, y, z, 1); },
    removePlatform(x, y, z) { map.bitNotXYZ(x, y, z, 1); },
    isSolid(x, y, z) { return (map.getXYZ(x, y, z) & 2) === 2; },
    isFreePlatform,
    map
};

function isFreePlatform(x, y, z) {
    return (map.getXYZ(x, y, z) & 3) === 1;
}

map.bitOrIndex = function(index, bit) {
    this.dataArray[index] |= bit;
};

map.bitOrXYZ = function(x, y, z, bit) {
    this.bitOrIndex(z * this.area + x * this.height + y, bit);
};

map.bitNotIndex = function(index, bit) {
    this.dataArray[index] &= ~bit;
};

map.bitNotXYZ = function(x, y, z, bit) {
    this.bitNotIndex(z * this.area + x * this.height + y, bit);
};