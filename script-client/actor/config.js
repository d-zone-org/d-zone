'use strict';
var configLoader = require('configloader');

module.exports = new configLoader({
    movement: {
        common: {
            ticks: 26,
            dx: 0,
            dy: 0
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
                sheetX: 28,
                loop: false,
                rate: 2,
                frames: 13,
                frameW: 35,
                frameH: 27,
                deltaX: 1,
                deltaY: 0,
                zDepthFrames: [6,9]
            },
            north: {
                sheetY: 27,
                offsetX: -9,
                offsetY: -15,
                zDepthValues: [-1,0]
            },
            west: {
                sheetY: 54,
                offsetX: -26,
                offsetY: -15,
                zDepthValues: [-1,0]
            },
            south: {
                sheetY: 81,
                offsetX: -26,
                offsetY: -6,
                zDepthValues: [1,1]
            },
            east: {
                sheetY: 0,
                offsetX: -9,
                offsetY: -6,
                zDepthValues: [1,1]
            }
        },
        hopUp: {
            offsetYFrames: [4,5,6,7,8,9],
            offsetYValues: [-1,-2,-2,-1,-1,-1],
        },
        hopDown: {
            offsetYFrames: [5,6,7,8,9],
            offsetYValues: [1,1,1,2,3],
        }
    }
});