'use strict';
var ComponentManager = require('man-component');
var util = require('dz-util');

var spriteData, transformData; // Reference to sprite and transform data
var zBuffer; // Depth-sorted sprites
var dirtyBuffer = false; // Indicates whether Z-buffer needs sorting
var dirtySprites = []; // List of entities that had non-transformative sprite changes
var dirtyTransforms = []; // List of entities that had transformative sprite changes

module.exports = {
    init() {
        spriteData = ComponentManager.getComponentData([require('com-sprite3d')])[0];
        transformData = ComponentManager.getComponentData([require('com-transform')])[0];
    },
    refreshZBuffer() {
        zBuffer = spriteData.slice(1); // Shallow copy (index 0 is empty)
        dirtyBuffer = true;
    },
    getZDepth: getZDepth,
    getDrawX: getDrawX,
    getDrawY: getDrawY,
    getDrawXY: getDrawXY,
    getZBuffer() {
        // Update entities with non-transformative sprite changes
        for(var s = 0; s < dirtySprites.length; s++) {
            updateSprite(dirtySprites[s]);
        }
        dirtySprites = [];
        // Update entities with transformative sprite changes
        for(var t = 0; t < dirtyTransforms.length; t++) {
            updateTransform(dirtyTransforms[t]);
        }
        dirtyTransforms = [];
        dirtySprites.length = 0;
        dirtyTransforms.length = 0;
        if(dirtyBuffer) { // If sprites need to be re-sorted
            util.removeEmptyIndexes(zBuffer); // Compress array
            insertionSort(zBuffer, depthSort);
            dirtyBuffer = false; // All sprites are sorted
        }
        return zBuffer;
    },
    updateSprite(entity) {
        var transform = transformData[entity];
        if(transform && transform.dirty) return; // Transform already dirty, no need to dirty sprite
        if(spriteData[entity].dirty) return; // Sprite already marked dirty
        dirtySprites.push(entity);
        spriteData[entity].dirty = true;
    },
    updateTransform(entity) {
        var transform = transformData[entity];
        if(!transform || transformData[entity].dirty) return; // Transform already marked dirty
        dirtyTransforms.push(entity);
        transformData[entity].dirty = true;
    }
};

function updateSprite(entity) {
    var sprite = spriteData[entity];
    if(!sprite) return;
    sprite.dirty = false;
    sprite.fdx = sprite.dx + sprite.dox;
    sprite.fdy = sprite.dy + sprite.doy;
}

function updateTransform(entity) {
    var transform = transformData[entity];
    if(!transform) return;
    var sprite = spriteData[entity];
    transform.dirty = false;
    var oldZDepth = sprite.zDepth;
    sprite.dx = getDrawX(transform.x, transform.y);
    sprite.dy = getDrawY(transform.x, transform.y, transform.z);
    sprite.fdx = sprite.dx + sprite.dox;
    sprite.fdy = sprite.dy + sprite.doy;
    sprite.zDepth = getZDepth(transform.x, transform.y);
    if(oldZDepth !== sprite.zDepth) dirtyBuffer = true;
    
}

function depthSort(a, b) {
    return a.zDepth - b.zDepth || b.dy - a.dy;
}

function getZDepth(x, y) {
    return (x + y) * 2;
}

function getDrawX(x, y) {
    return (x - y) * 16;
}

function getDrawY(x, y, z) {
    return (x + y) * 8 - z * 8;
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