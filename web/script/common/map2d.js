'use strict';
var util = require('./util');

module.exports = Map2D;

function Map2D(width,height) {
    this.width = width;
    this.height = height;
    // Grid data is stored in a flattened, 2D, 8-bit unsigned integer array
    this.dataArray = new Uint8Array(width * height);
}

Map2D.prototype.setXY = function(x, y, value) {
    this.setIndex(x * this.width + y,value);
};

Map2D.prototype.getXY = function(x, y) {
    return this.dataArray[x * this.width + y];
};

Map2D.prototype.setIndex = function(index,value) {
    this.dataArray[index] = value;
    this.maxValue = Math.max(this.maxValue || 0,value);
};

Map2D.prototype.getIndex = function(index) {
    return this.dataArray[index];
};

Map2D.prototype.getColumn = function(x) {
    return this.dataArray.slice(x * this.width, x * this.width + this.width);
};

Map2D.prototype.XYFromIndex = function(index) {
    return { x: Math.floor(index/this.width), y: index % this.width };
};

Map2D.prototype.indexFromXY = function(x,y) {
    return x * this.width + y;
};

Map2D.prototype.forEachTile = function(cb) {
    this.dataArray.forEach(function(val,index,arr) {
        cb(val,index,arr);
    });
};

Map2D.prototype.iterateRelativeTileList = function(x,y,list,cb) {
    var self = this;
    list.forEach(function(val,index) {
        cb(val.x,val.y,self.getXY(x+val.x,y+val.y),self.indexFromXY(x+val.x,y+val.y),index);
    });
};

Map2D.prototype.forEachNeighbor = function(x,y,cb) {
    this.iterateRelativeTileList(x,y,neighbors,cb);
};

Map2D.prototype.forEachNeighborExtended = function(x,y,cb) {
    this.iterateRelativeTileList(x,y,neighborsExtended,cb);
};

Map2D.prototype.getRandomTile = function() {
    var target = arguments[0],
        attempt = 0,
        limit = this.width * this.height * 2;
    do {
        var picked = util.randomIntRange(0,this.dataArray.length-1),
            pickedValue = this.dataArray[picked],
            pickedXY = this.XYFromIndex(picked);
        attempt++;
    } while(attempt < limit && (pickedValue !== target || (target === undefined && pickedValue === 0)));
    return { index: picked, value: pickedValue, x: pickedXY.x, y: pickedXY.y };
};

Map2D.prototype.checkNeighborsExtended = function(x,y,validTypes) {
    if(typeof validTypes === 'number') validTypes = [validTypes];
    var valid = true;
    this.iterateRelativeTileList(x,y,neighborsExtended,function(nx,ny,nVal) {
        if(validTypes.indexOf(nVal) < 0) {
            valid = false;
        }
    });
    return valid;
};

Map2D.prototype.print = function() {
    console.log('Printing ' + (arguments[0] || '') + ' map',this.width,'x',this.height);
    var tileRow, colorRow;
    for(var y = -1; y < this.height; y++) {
        tileRow = y >= 0 ? ('   ' + y).substr(-3,3) + ' ' : '   ';
        
        colorRow = [];
        for(var x = 0; x < this.width; x++) {
            if(y == -1) {
                tileRow += ('   ' + x).substr(-3,3);
                continue;
            }
            var tileValue = this.getXY(x,y);
            tileRow += tileValue ? '%c  %c ' : '%c[]%c ';
            colorRow.push('color: #ddd; background:rgb(' + getTileColor(arguments[0],this.getXY(x,y)) + ')');
            colorRow.push('background:white');
        }
        colorRow.unshift(tileRow);
        console.log.apply(console,colorRow);
    }
};

function getTileColor(type,value) { // For printing in console
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