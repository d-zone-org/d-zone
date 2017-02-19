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
    textures: {
        idle: {
            common: {
                sheet: 'actors',
                frameX: 0,
                frameY: 0,
                frameW: 14,
                frameH: 14
            },
            north: {
                frameX: 14
            },
            west: {
                frameX: 14
            },
            south: { },
            east: {
                frameY: 56
            }
        },
        hop: {
            common: {
                sheet: 'actors',
                frameX: 28,
                frameY: 0,
                frames: 13,
                frameW: 35,
                frameH: 27,
                deltaX: 1,
                deltaY: 0
            },
            north: {
                frameY: 54
            },
            west: {
                frameY: 81
            },
            south: { },
            east: {
                frameY: 27
            }
        },
        speak: {
            common: {
                sheet: 'actors',
                frameX: 0,
                frameY: 0,
                frames: 4,
                frameW: 14,
                frameH: 14,
                deltaX: 0,
                deltaY: 1
            },
            south: { },
            east: {
                frameY: 56
            }
        }
    },
    sprites: {
        common: {
            texturePath: ['actors','idle'],
            dox: -7,
            doy: -4,
            hitArea: [0,2, 7,-1, 14,2, 14,12, 7,15, 0,12]
        },
        idle: {
            north: { },
            west: { },
            south: { },
            east: { }
        }
    },
    animations: {
        hop: {
            common: {
                loop: false,
                rate: 2,
                frames: 13,
                zDepthFrames: [6,9]
            },
            north: {
                texturePath: ['actors','hop','north'],
                offsetX: -9,
                offsetY: -15,
                zDepthValues: [-1,0]
            },
            west: {
                texturePath: ['actors','hop','west'],
                offsetX: -26,
                offsetY: -15,
                zDepthValues: [-1,0]
            },
            south: {
                texturePath: ['actors','hop','south'],
                offsetX: -26,
                offsetY: -6,
                zDepthValues: [1,1]
            },
            east: {
                texturePath: ['actors','hop','east'],
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
        },
        speak: {
            common: {
                loop: true,
                rate: 5,
                offsetX: -7,
                offsetY: -4,
                frames: 4,
            },
            south: {
                texturePath: ['actors','speak','south']
            },
            east: {
                texturePath: ['actors','speak','east']
            }
        }
    }
});