'use strict';
var ComponentManager = require('man-component');
var util = require('dz-util');

var spriteData; // Reference to sprite data
var zBuffer; // Depth-sorted sprites
var dirtyBuffer = false; // Indicates whether Z-buffer needs sorting
var dirtySprites = []; // List of entities that need their sprites recalculated

module.exports = {
    init: function() {
        spriteData = ComponentManager.getComponentData([require('com-sprite3d')])[0];
    },
    refreshZBuffer: function() {
        //if(sprites.constructor !== Array) sprites = [sprites];
        zBuffer = spriteData.slice(0); // Shallow copy
        dirtyBuffer = true;
    },
    getZDepth: getZDepth,
    getDrawX: getDrawX,
    getDrawY: getDrawY,
    getDrawXY: getDrawXY,
    getZBuffer: function() {
        if(dirtySprites.length > 0) { // If there are sprites that need to be recalculated
            for(var i = 0; i < dirtySprites.length; i++) {
                updateSprite(dirtySprites[i]);
            }
            dirtySprites = [];
        }
        if(dirtyBuffer) { // If sprites need to be re-sorted
            util.removeEmptyIndexes(zBuffer); // Compress array
            insertionSort(zBuffer, depthSort);
            dirtyBuffer = false; // All sprites are sorted
        }
        return zBuffer;
    },
    updateSprite: function(entity) {
        if(spriteData[entity].dirty) return; // Sprite already marked dirty
        dirtySprites.push(entity);
        spriteData[entity].dirty = true;
    }
};

function updateSprite(entity) {
    var sprite = spriteData[entity];
    sprite.dirty = false;
    var oldZDepth = sprite.zDepth;
    sprite.dx = getDrawX(sprite.x, sprite.y);
    sprite.dy = getDrawY(sprite.x, sprite.y, sprite.z);
    sprite.fdx = sprite.dx + sprite.dox;
    sprite.fdy = sprite.dy + sprite.doy;
    sprite.zDepth = getZDepth(sprite.x, sprite.y);
    if(oldZDepth !== sprite.zDepth) dirtyBuffer = true;
}

function depthSort(a, b) {
    return a.zDepth - b.zDepth;
}

function getZDepth(x, y) {
    return (x + y) * 2;
}

function getDrawX(x, y) {
    return (x - y) * 16;
}

function getDrawY(x, y, z) {
    return (x + y) * 8 - z * 16;
}

function getDrawXY(x, y, z) {
    return [getDrawX(x, y), getDrawY(x, y, z)];
}

// Faster sorting for nearly-sorted arrays (like the z-buffer) - https://jsperf.com/smv-insertion-sort/2
function insertionSort(array, comp) {
    var n = array.length;
    for (var i = 1; i < n; ++i) {
        var tmp = array[i];
        if (comp(array[i - 1], tmp) > 0) {
            var j = i;
            do {
                array[j] = array[j - 1];
                --j;
            } while (j > 0 && comp(array[j - 1], tmp) > 0);
            array[j] = tmp;
        }
    }
}