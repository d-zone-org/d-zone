'use strict';
var configLoader = require('configloader');

module.exports = new configLoader({
    movement: {
        common: {
            ticks: 26
        },
        north: {
            dy: -1
        },
        west: {
            dx: -1
        },
        south: {
            dy: 1
        },
        east: {
            dx: 1
        }
    },
    sprites: {
        common: {
            sheet: 'actors',
            sheetX: 0,
            sheetY: 0,
            sheetW: 14,
            sheetH: 14,
            dox: -7,
            doy: -4
        },
        idle: {
            north: {
                sheetX: 14
            },
            west: {
                sheetX: 14
            },
            south: { },
            east: {
                sheetY: 56
            }
        }
    },
    animations: {
        hop: {
            common: {
                sheet: 'actors',
                sheetX: 28,
                loop: false,
                rate: 2,
                frames: 13,
                frameW: 35,
                frameH: 27,
                deltaX: 1,
                deltaY: 0,
                zDepthFrames: [6]
            },
            north: {
                sheetY: 27,
                offsetX: -9,
                offsetY: -15,
                zDepthValues: [-1]
            },
            west: {
                sheetY: 54,
                offsetX: -26,
                offsetY: -15,
                zDepthValues: [-1]
            },
            south: {
                sheetY: 81,
                offsetX: -26,
                offsetY: -6,
                zDepthValues: [1]
            },
            east: {
                sheetY: 0,
                offsetX: -9,
                offsetY: -6,
                zDepthValues: [1]
            }
        }
    }
});