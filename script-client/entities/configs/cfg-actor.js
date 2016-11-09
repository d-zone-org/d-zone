'use strict';

module.exports = {
    common: {
        sheet: 'actors'
    },
    sprites: {
        common: {
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
                zDepthFrames: [6],
                zDepthValues: [1]
            },
            east: {
                sheetY: 0,
                offsetX: -9,
                offsetY: -6
            }
        }
    }
};