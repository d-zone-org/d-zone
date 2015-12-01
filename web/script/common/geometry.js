'use strict';
var util = require('./util.js');

var closestGrids = [];

module.exports = {
    generateClosestGrids: function(size) {
        for(var sx = size*-1; sx <= size; sx++) { for(var sy = size*-1; sy <= size; sy++) {
            closestGrids.push([sx,sy]);
        }}
        closestGrids.sort(function(a,b) {
            return (Math.abs(a[0]) + Math.abs(a[1])) - (Math.abs(b[0]) + Math.abs(b[1]))
        });
    },
    closestGrids: closestGrids,
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
    get8Neighbors: function(grid) {
        var x = +grid.split(':')[0], y = +grid.split(':')[1];
        return { 
            n: x+':'+(y-1), e: (x+1)+':'+y, s: x+':'+(y+1), w: (x-1)+':'+y,
            nw: (x-1)+':'+(y-1), ne: (x+1)+':'+(y-1), sw: (x-1)+':'+(y+1), se: (x+1)+':'+(y+1)
        }
    },
    getDistance: function(a,b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
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