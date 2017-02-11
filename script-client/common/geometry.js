'use strict';
var util = require('dz-util');
var Map2D = require('map2d');

module.exports = {
    DIRECTIONS: {
        north: { x: 0, y: -1 },
        east: { x: 1, y: 0 },
        south: { x: 0, y: 1 },
        west: { x: -1, y: 0 }
    },
    randomDirection() {
        return this.DIRECTIONS[util.pickInObject(this.DIRECTIONS)];
    },
    getNeighbors(grid) {
        var x = +grid.split(':')[0], y = +grid.split(':')[1];
        return { n: x+':'+(y-1), e: (x+1)+':'+y, s: x+':'+(y+1), w: (x-1)+':'+y }
    },
    get8Neighbors(grid) {
        var x = +grid.split(':')[0], y = +grid.split(':')[1];
        return { 
            n: x+':'+(y-1), e: (x+1)+':'+y, s: x+':'+(y+1), w: (x-1)+':'+y,
            nw: (x-1)+':'+(y-1), ne: (x+1)+':'+(y-1), sw: (x-1)+':'+(y+1), se: (x+1)+':'+(y+1)
        }
    },
    getDistance(a,b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    },
    intervalOverlaps(a1,a2,b1,b2) {
        return a1 >= b1 && a1 < b2 || b1 >= a1 && b1 < a2;
    },
    buildNoiseMap(width, height) {
        width = Math.round(width);
        height = Math.round(height);
        var map = new Map2D(Array, width, height);
        for(var g = 0; g < width * height; g++) {
            map.setIndex(g, Math.random());
        }
        return map;
    },
    getNoiseMapPoint(map, x, y) {
        var floorX = Math.floor(x);
        var lowerXArray = map.getColumn(floorX);
        if(floorX == x) return util.fractionalArrayIndex(lowerXArray, y);
        var ceilX = Math.ceil(x);
        var upperXArray = map.getColumn(ceilX);
        var floorY = Math.floor(y);
        if(floorY == y) return util.fractionalArrayIndex([lowerXArray[floorY], upperXArray[floorY]], x - floorX);
        var lowerXY = util.fractionalArrayIndex(lowerXArray, y);
        var upperXY = util.fractionalArrayIndex(upperXArray, y);
        return util.fractionalArrayIndex([lowerXY,upperXY], x - floorX);
    }
};