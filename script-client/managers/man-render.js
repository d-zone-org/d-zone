'use strict';

var zBuffer = []; // Holds depth-sorted sprites
var dirty = false; // Indicates whether Z-buffer needs sorting

module.exports = {
    setZBuffer: function(sprites) {
        //if(sprites.constructor !== Array) sprites = [sprites];
        zBuffer = sprites.slice(0); // Shallow copy
        dirty = true;
    },
    getZDepth: getZDepth,
    getDrawX: getDrawX,
    getDrawY: getDrawY,
    getDrawXY: getDrawXY,
    makeDirty: function() {
        dirty = true;
    },
    getZBuffer: function() {
        if(dirty) { // If sprites need to be re-sorted
            insertionSort(zBuffer, depthSort);
            dirty = false; // All sprites are sorted
        }
        return zBuffer;
    }
};

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

// Faster sorting for nearly-sorted arrays (like the z-buffer)
// https://jsperf.com/smv-insertion-sort/2
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