'use strict';
var util = require('./util.js');
module.exports = {
    DIRECTIONS: {
        north: { x: 0, y: -1 },
        east: { x: 1, y: 0 },
        south: { x: 0, y: 1 },
        west: { x: -1, y: 0 }
    },
    randomDirection: function() {
        return this.DIRECTIONS[util.pickInObject(this.DIRECTIONS)];
    },
    getNeighbors: function(grid) {
        var x = +grid.split(':')[0], y = +grid.split(':')[1];
        return { n: x+':'+(y-1), e: (x+1)+':'+y, s: x+':'+(y+1), w: (x-1)+':'+y }
    },
    intervalOverlaps: function(a1,a2,b1,b2) {
        return a1 >= b1 && a1 < b2 || b1 >= a1 && b1 < a2;
    },
    buildNoiseMap: function(width, height) {
        var map = [];
        for(var x = 0; x < width; x++) {
            map.push([]);
            for(var y = 0; y < height; y++) {
                map[x].push(Math.random());
            }
        }
        return map;
    },
    getNoiseMapPoint: function(map, x, y) {
        var floorX = Math.floor(x);
        var lowerXArray = map[floorX];
        if(floorX == x) return util.fractionalArrayIndex(lowerXArray, y);
        var ceilX = Math.ceil(x);
        var upperXArray = map[ceilX];
        var floorY = Math.floor(y);
        if(floorY == y) {
            return util.fractionalArrayIndex([lowerXArray[floorY], upperXArray[floorY]], x - floorX);
        }
        var lowerXY = util.fractionalArrayIndex(lowerXArray, y);
        var upperXY = util.fractionalArrayIndex(upperXArray, y);
        return util.fractionalArrayIndex([lowerXY,upperXY], x - floorX);
    }
};