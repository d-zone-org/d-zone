'use strict';
var Map2D = require('map2d');
var inherits = require('inherits');

module.exports = Map3D;

inherits(Map3D,Map2D);

function Map3D(width, height) {
    Map2D.call(this,Array,width,height);
    this.forEachTile(function(val,index,arr) {
        arr[index] = [];
    },true);
}