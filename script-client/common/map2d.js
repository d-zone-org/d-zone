'use strict';
var util = require('dz-util');

module.exports = Map2D;

function Map2D(arrayType, width, height, buffer) {
    this.width = width;
    this.height = height;
    this.dataArray = buffer ? new arrayType(buffer) : new arrayType(width * height);
    this.buffer = this.dataArray.buffer;
}

Map2D.prototype.setIndex = function(index, value) {
    this.dataArray[index] = value;
    // this.maxValue = Math.max(this.maxValue || 0, value);
};

Map2D.prototype.setXY = function(x, y, value) {
    this.setIndex(x * this.width + y, value);
};

Map2D.prototype.getIndex = function(index) {
    return this.dataArray[index];
};

Map2D.prototype.getXY = function(x, y) {
    if(x < 0 || y < 0 || x > this.width-1 || y > this.height - 1) return 0;
    return this.dataArray[x * this.width + y];
};

Map2D.prototype.getColumn = function(x) {
    return this.dataArray.slice(x * this.width, x * this.width + this.width);
};

Map2D.prototype.getRow = function(y) {
    var row = [], col;
    for(var x = 0; x < this.width; x++) {
        col = this.getColumn(x);
        row.push(col[y]);
    }
    return row;
};

Map2D.prototype.XYFromIndex = function(index) {
    return { x: Math.floor(index / this.width), y: index % this.width };
};

Map2D.prototype.indexFromXY = function(x, y) {
    return x * this.width + y;
};

Map2D.prototype.forEachTile = function(cb, includeUndefined) {
    for (var i = 0; i < this.dataArray.length; i++) {
        if (includeUndefined || i in this.dataArray) {
            cb(this.dataArray[i], i, this.dataArray);
        }
    }
};

Map2D.prototype.forEachTileIntersection = function(cb) {
    for(var ix = 0; ix < this.width + 1; ix++) for(var iy = 0; iy < this.height + 1; iy++) {
        cb(this.getXY(ix - 1, iy - 1), this.getXY(ix, iy - 1), this.getXY(ix, iy), this.getXY(ix - 1, iy), ix, iy);
    }
};

Map2D.prototype.iterateRelativeTileList = function(x, y, list, cb) {
    var self = this;
    list.forEach(function(val, index) {
        cb(val.x, val.y, self.getXY(x + val.x, y + val.y), self.indexFromXY(x + val.x, y + val.y), index);
    });
};

Map2D.prototype.forEachNeighbor = function(x, y, cb) {
    this.iterateRelativeTileList(x, y, neighbors, cb);
};

Map2D.prototype.forEachNeighborExtended = function(x, y, cb) {
    this.iterateRelativeTileList(x, y, neighborsExtended, cb);
};

Map2D.prototype.getRandomTile = function() {
    var target = arguments[0],
        attempt = 0,
        limit = this.width * this.height * 2;
    do {
        var picked = util.randomIntRange(0, this.dataArray.length - 1),
            pickedValue = this.dataArray[picked],
            pickedXY = this.XYFromIndex(picked);
        attempt++;
    } while(attempt < limit && (pickedValue !== target || (target === undefined && pickedValue === 0)));
    return { index: picked, value: pickedValue, x: pickedXY.x, y: pickedXY.y };
};

Map2D.prototype.checkNeighborsExtended = function(x, y, validTypes) {
    if(validTypes.constructor !== Array) validTypes = [validTypes];
    var valid = true;
    this.iterateRelativeTileList(x, y, neighborsExtended, function(nx, ny, nVal) {
        if(validTypes.indexOf(nVal) < 0) {
            valid = false;
        }
    });
    return valid;
};

Map2D.prototype.getBoundingBox = function() {
    return { 
        x: getBounds(this.width, this.getColumn.bind(this)), 
        y: getBounds(this.height, this.getRow.bind(this)) 
    }
};

Map2D.prototype.print = function(/*type*/) {
    console.log('Printing ' + (arguments[0] || '') + ' map', this.width, 'x', this.height);
    var tileRow, colorRow;
    for(var y = -1; y < this.height; y++) {
        tileRow = y >= 0 ? ('   ' + y).slice(-3) + ' ' : '   ';
        colorRow = [];
        for(var x = 0; x < this.width; x++) {
            if(y == -1) {
                tileRow += ('   ' + x).slice(-3);
                continue;
            }
            var tileValue = this.getXY(x, y);
            var emptyTile = x % 2 || y % 2 ? '[]' : '  ';
            tileRow += tileValue ? '%c  %c ' : '%c' + emptyTile + '%c ';
            colorRow.push('color: #ddd; background:rgb(' + getTileColor(arguments[0], tileValue) + ')');
            colorRow.push('background:white');
        }
        colorRow.unshift(tileRow);
        console.log.apply(console, colorRow);
    }
};

function getBounds(size, getRange) { // Lowest and highest non-zero X or Y, to define a bounding box
    var bounds = {}, dir = 1, range;
    for(var p = 0; p < size && p >= 0; p += dir) {
        range = getRange(p);
        for(var rp = 0; rp < range.length; rp++) {
            if(range[rp] > 0) {
                if(dir == 1) bounds.min = p; else bounds.max = p;
                break;
            }
        }
        if(dir == 1 && bounds.min >= 0) {
            dir = -1;
            p = size;
        } else if(dir == -1 && bounds.max >= 0) break;
    }
    return bounds;
}

function getTileColor(type, value) { // For printing in console
    if(!type) return 255-value;
    if(type == 'world') {
        switch(value) {
            case 0: return [255,255,255];
            case 1: return [140,119,107]; // Slab
            case 2: return [104,149,70]; // Grass
            case 3: return util.pickInArray([[93,191,240],[204,86,169],[201,201,64],[140,102,222]]); // Flower
            default: return [128,128,128]
        }
    }
}

var neighbors = [{ x:-1, y:0 }, { x:1, y:0 }, { x:0, y:-1 }, { x:0, y:1 }]; // W E N S
var neighborsExtended = neighbors.concat([
    { x:-1, y:-1 }, { x:1, y:1 }, { x:1, y:-1 }, { x:-1, y:1 } // NW SE NE SW
]);