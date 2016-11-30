'use strict';
var util = require('dz-util');

module.exports = Map3D;

function Map3D(arrayType, width, height, depth, buffer) {
    this.width = width;
    this.height = height;
    this.area = width * height;
    this.depth = depth;
    this.dataArray = buffer ? new arrayType(buffer) : new arrayType(this.area * depth);
    this.buffer = this.dataArray.buffer;
}

Map3D.prototype.setIndex = function(index, value) {
    this.dataArray[index] = value;
};

Map3D.prototype.setXYZ = function(x, y, z, value) {
    this.setIndex(z * this.area + x * this.height + y, value);
};

Map3D.prototype.getIndex = function(index) {
    return this.dataArray[index];
};

Map3D.prototype.getXYZ = function(x, y, z) {
    if(x < 0 || y < 0 || z < 0 || x >= this.width || y >= this.height || z >= this.depth) return 0;
    return this.dataArray[z * this.area + x * this.height + y];
};

Map3D.prototype.XYZFromIndex = function(index) {
    return { x: Math.floor(index / this.height), y: index % this.height, z: Math.floor(index / this.area) };
};

Map3D.prototype.indexFromXYZ = function(x, y, z) {
    return z * this.area + x * this.height + y;
};

Map3D.prototype.forEachTile = function(cb, includeUndefined) {
    for (var i = 0; i < this.dataArray.length; i++) {
        if (includeUndefined || i in this.dataArray) {
            cb(this.dataArray[i], i, this.dataArray);
        }
    }
};

Map3D.prototype.forEachTileAtZ = function(z, cb, includeUndefined) {
    for (var i = z * this.area; i < (z + 1) * this.area; i++) {
        if (includeUndefined || i in this.dataArray) {
            cb(this.dataArray[i], i, this.dataArray);
        }
    }
};