'use strict';
var util = require('./util');
var Map2D = require('./map2d');

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
        width = Math.round(width);
        height = Math.round(height);
        var map = new Map2D(Uint8Array,width,height);
        for(var g = 0; g < width*height; g++) {
            map.setIndex(g,util.randomIntRange(0,255));
        }
        return map;
    },
    getNoiseMapPoint: function(map, x, y) {
        //console.log('getNoiseMapPoint:',x,y);
        var floorX = Math.floor(x);
        var lowerXArray = map.getColumn(floorX);
        //console.log(lowerXArray);
        if(floorX == x) return Math.round(util.fractionalArrayIndex(lowerXArray, y));
        var ceilX = Math.ceil(x);
        var upperXArray = map.getColumn(ceilX);
        var floorY = Math.floor(y);
        if(floorY == y) return Math.round(util.fractionalArrayIndex([lowerXArray[floorY], upperXArray[floorY]], x - floorX));
        var lowerXY = util.fractionalArrayIndex(lowerXArray, y);
        var upperXY = util.fractionalArrayIndex(upperXArray, y);
        return Math.round(util.fractionalArrayIndex([lowerXY,upperXY], x - floorX));
    }
};