'use strict';
var Map2D = require('map2d');

var width, height;

addEventListener('message', function(event) {
    if(!width) { // Map size not yet defined, so this must be the init message
        width = event.data[0];
        height = event.data[1];
        return;
    }
    console.log('Path worker received job',event.data);
    event.data.collision = new Map2D(Uint32Array, width, height, event.data.collision);
    var path = getPath(event.data);
    postMessage([event.data.id, event.data.e, path]);
});

// Path data stored in Uint8Array
// Bit  1   : XY distance (0 - 1)
// Bits 2-3 : XY Direction (north, east, south, west)
// Bit  4   : Z direction (down, up)
// Bits 5-8 : Z distance (0 - 15)

function getPath(job) {
    var path = new Path();
    return path.trim();
}

function Path() {
    this.pushIndex = 0;
    this.arr = new Uint8Array(4);
}

Path.prototype.push = function(int) {
    if(this.arr.length === this.pushIndex) {
        var newArr = new Uint8Array(this.arr.length * 2);
        newArr.set(this.arr);
        this.arr = newArr;
    }
    this.arr[this.pushIndex++] = int;
};

Path.prototype.trim = function() {
    return new Uint8Array(this.arr.buffer, 0, this.pushIndex);
};