'use strict';

var map = {
    actor: {
        online: {
            north: { x: 28, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
            south: { x: 0, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
            east: { x: 14, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
            west: { x: 28, y: 0, w: 14, h: 14, ox: 0, oy: 5 }
        },
        idle: {
            north: { x: 56, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
            south: { x: 42, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
            east: { x: 56, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
            west: { x: 42, y: 0, w: 14, h: 14, ox: 0, oy: 5 }
        },
        offline: {
            north: { x: 84, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
            south: { x: 70, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
            east: { x: 84, y: 0, w: 14, h: 14, ox: 0, oy: 5 },
            west: { x: 70, y: 0, w: 14, h: 14, ox: 0, oy: 5 }
        },
        hopping: {
            animation: { frames: 13, zStartFrame: 3 },
            north: { x: 0, y: 83, w: 35, h: 27, ox: -2, oy: -6 },
            south: { x: 0, y: 137, w: 35, h: 27, ox: -19, oy: 3 },
            east: { x: 0, y: 56, w: 35, h: 27, ox: -2, oy: 3 },
            west: { x: 0, y: 110, w: 35, h: 27, ox: -19, oy: -6 }
        }
    }
};

module.exports = Sheet;

function Sheet(spriteName) {
    this.map = JSON.parse(JSON.stringify(map[spriteName]));
}