'use strict';
var util = require('dz-util');

module.exports = Map2D;

function Map2D(arrayType, width, height, buffer) {
    this.width = width;
    this.height = height || width;
    this.area = this.width * this.height;
    this.dataArray = buffer ? new arrayType(buffer) : new arrayType(this.area);
    this.buffer = this.dataArray.buffer;
}

Map2D.prototype.setIndex = function(index, value) {
    this.dataArray[index] = value;
};

Map2D.prototype.setXY = function(x, y, value) {
    this.setIndex(x * this.height + y, value);
};

Map2D.prototype.getIndex = function(index) {
    return this.dataArray[index];
};

Map2D.prototype.getXY = function(x, y) {
    if(x < 0 || y < 0 || x >= this.width || y >= this.height) return 0;
    return this.dataArray[x * this.height + y];
};

Map2D.prototype.getColumn = function(x) {
    return this.dataArray.slice(x * this.height, x * this.height + this.height);
};

Map2D.prototype.getRow = function(y) {
    var row = [];
    for(var i = y; i < this.area; i += this.height) row.push(this.dataArray[i]);
    return row;
};

Map2D.prototype.getBox = function(x, y, w, h) {
    var values = [];
    for(var ix = x; ix < x + w; ix++) {
        var column = this.getColumn(ix);
        values.push(...column.slice(y, y + h));
    }
    return values;
};

Map2D.prototype.XYFromIndex = function(index) {
    return { x: Math.floor(index / this.height), y: index % this.height };
};

Map2D.prototype.indexFromXY = function(x, y) {
    return x * this.height + y;
};

Map2D.prototype.forEachTile = function(cb) {
    for (var i = 0; i < this.dataArray.length; i++) {
        cb(this.dataArray[i], i, this.dataArray);
    }
};

Map2D.prototype.forEachTileIntersection = function(cb) {
    for(var ix = 0; ix < this.width + 1; ix++) for(var iy = 0; iy < this.height + 1; iy++) {
        cb(this.getXY(ix - 1, iy - 1), this.getXY(ix, iy - 1), this.getXY(ix, iy), this.getXY(ix - 1, iy), ix, iy);
    }
};

Map2D.prototype.iterateRelativeTileList = function(x, y, list, cb) {
    for(var i = 0; i < list.length; i++) {
        var val = list[i];
        cb(val.x, val.y, this.getXY(x + val.x, y + val.y), this.indexFromXY(x + val.x, y + val.y), i);
    }
};

Map2D.prototype.forEachNeighbor = function(x, y, cb) {
    this.iterateRelativeTileList(x, y, neighbors, cb);
};

Map2D.prototype.forEachNeighborExtended = function(x, y, cb) {
    this.iterateRelativeTileList(x, y, neighborsExtended, cb);
};

Map2D.prototype.getTiles = function(values, notIndexes) {
    notIndexes = notIndexes || [];
    var indexPool = [];
    for(var i = 0; i < this.dataArray.length; i++) {
        if(!notIndexes.includes(i) && (!values || values.includes(this.dataArray[i]))) indexPool.push(i)
    }
    return indexPool;
};

Map2D.prototype.getRandomTile = function(values, notIndexes) { // Avoid using, make a cache with getTiles
    notIndexes = notIndexes || [];
    var picked = { index: util.random(this.dataArray.length - 1) };
    picked.value = this.dataArray[picked.index];
    picked.xy = this.XYFromIndex(picked.index);
    if((!values || values.includes(picked.value)) && !notIndexes.includes(picked.index)) {
        return picked;
    }
    var indexPool = this.getTiles(values, notIndexes);
    if(indexPool.length > 0) {
        picked.index = util.pickInArray(indexPool);
        picked.value = this.dataArray[picked.index];
        picked.xy = this.XYFromIndex(picked.index);
        return picked;
    }
};

Map2D.prototype.checkNeighborsExtended = function(x, y, validTypes) {
    if(validTypes.constructor !== Array) validTypes = [validTypes];
    var valid = true;
    this.iterateRelativeTileList(x, y, neighborsExtended, function(nx, ny, nVal) {
        if(!validTypes.includes(nVal)) {
            valid = false;
        }
    });
    return valid;
};

Map2D.prototype.traverseSpiral = function(x, y, cb) {
    // Travel in an outward spiral and send to callback, break on return value and return coordinates
    var lastXDist = 0, lastYDist = 0,
        tx = 0, ty = 0, dir = 1, finished;
    while(!finished) {
        if(tx > lastXDist) { // Done traversing X
            lastXDist++;
            tx = 0;
        } else if(ty > lastYDist) { // Done traversing Y
            lastYDist++;
            ty = 0;
            dir *= -1;
        }
        if(tx > 0 || lastXDist === lastYDist) { // Traverse X
            x += dir;
            tx++;
        } else { // Traverse Y
            y += dir;
            ty++;
        }
        finished = cb(this.getXY(x, y));
    }
    return { x, y };
};

Map2D.prototype.getBoundingBox = function() {
    return { 
        x: getBounds(this.width, this.getColumn.bind(this)), 
        y: getBounds(this.height, this.getRow.bind(this)) 
    }
};

Map2D.prototype.print = function(type) {
    console.log('Printing ' + (type || 'value') + ' map', this.width, 'x', this.height);
    var tileRow, colorRow;
    for(var y = -1; y < this.height; y++) {
        tileRow = y >= 0 ? ('   ' + y).slice(-3) + ' ' : '   ';
        colorRow = [];
        for(var x = 0; x < this.width; x++) {
            if(y == -1) {
                tileRow += ('   ' + x).slice(-3);
                continue;
            }
            var value = this.getXY(x, y);
            var emptyTile = x % 2 || y % 2 ? '[]' : '  ';
            var valueTile = type === 'numeric' ? ('  ' + value.toString(16).toUpperCase()).slice(-2) : '  ';
            tileRow += value ? `%c${valueTile}%c ` : '%c' + emptyTile + '%c ';
            colorRow.push(`color: #${value ? '000' : 'ddd'}; background:rgb(${getTileColor(type, value)}`);
            colorRow.push('background:white');
        }
        colorRow.unshift(tileRow);
        console.log(...colorRow);
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