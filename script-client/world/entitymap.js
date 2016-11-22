'use strict';
var util = require('dz-util');
var Map3D = require('map3d');

var map = new Map3D(Uint32Array, 0, 0, 0);
var multiFlag = 1 << 31 >>> 0;
var multiMap;

module.exports = {
    init(w, h, d) {
        map.width = w;
        map.height = h;
        map.depth = d;
        map.area = w * h;
        map.dataArray = new map.dataArray.constructor(map.area * d);
        map.buffer = map.dataArray.buffer;
        multiMap = new Map3D(Array, w, h, d);
    },
    addEntity(index, e) {
        var targetIndex = map.getIndex(index);
        if(targetIndex << 1) { // If one entity already here
            map.setIndex(index, multiFlag);
            multiMap.setIndex(index, [targetIndex, e]);
        } else if(targetIndex) { // If multiple entities already here
            multiMap.getIndex(index).push(e);
        } else { // No entity here
            map.setIndex(index, e);
        }
    },
    removeEntity(index, e) {
        var targetIndex = map.getIndex(index);
        if(targetIndex << 1) { // If entity is the only one here
            map.setIndex(index, 0);
            return false;
        }
        if(targetIndex) { // If multiple entities were here
            var multi = multiMap.getIndex(index);
            util.removeFromArray(e, multi);
            if(multi.length === 1) { // If only one entity remains
                map.setIndex(index, multi[0]);
                multiMap.setIndex(index, undefined);
                return [e];
            }
            return multi;
        }
    },
    getEntities(index) {
        var targetIndex = map.getIndex(index);
        if(targetIndex << 1) { // If one entity here
            return [targetIndex];
        } else if(targetIndex) {
            return multiMap.getIndex(index);
        } else return [];
    },
    map
};