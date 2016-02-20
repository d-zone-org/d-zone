'use strict';

var map = {
    tile: {
        'G-G-G-G': {x: 0, y: 108, w: 32, h: 18}, // Grass/Slab
        'S-S-S-S': {x: 32, y: 90, w: 32, h: 18},
        'G-S-G-S': {x: 64, y: 90, w: 32, h: 18},
        'S-G-S-G': {x: 96, y: 90, w: 32, h: 18},
        'G-G-G-S': {x: 0, y: 18, w: 32, h: 18},
        'S-G-G-G': {x: 0, y: 36, w: 32, h: 18},
        'G-S-G-G': {x: 0, y: 54, w: 32, h: 18},
        'G-G-S-G': {x: 0, y: 72, w: 32, h: 18},
        'S-G-G-S': {x: 32, y: 18, w: 32, h: 18},
        'S-S-G-G': {x: 32, y: 36, w: 32, h: 18},
        'G-S-S-G': {x: 32, y: 54, w: 32, h: 18},
        'G-G-S-S': {x: 32, y: 72, w: 32, h: 18},
        'S-S-G-S': {x: 64, y: 18, w: 32, h: 18},
        'S-S-S-G': {x: 64, y: 36, w: 32, h: 18},
        'G-S-S-S': {x: 64, y: 54, w: 32, h: 18},
        'S-G-S-S': {x: 64, y: 72, w: 32, h: 18},
        
        'F-F-F-F': {x: 64, y: 198, w: 32, h: 18}, // Grass/Flower
        'G-F-G-F': {x: 0, y: 198, w: 32, h: 18},
        'F-G-F-G': {x: 32, y: 198, w: 32, h: 18},
        'G-G-G-F': {x: 0, y: 126, w: 32, h: 18},
        'F-G-G-G': {x: 0, y: 144, w: 32, h: 18},
        'G-F-G-G': {x: 0, y: 162, w: 32, h: 18},
        'G-G-F-G': {x: 0, y: 180, w: 32, h: 18},
        'F-G-G-F': {x: 32, y: 126, w: 32, h: 18},
        'F-F-G-G': {x: 32, y: 144, w: 32, h: 18},
        'G-F-F-G': {x: 32, y: 162, w: 32, h: 18},
        'G-G-F-F': {x: 32, y: 180, w: 32, h: 18},
        'F-F-G-F': {x: 64, y: 126, w: 32, h: 18},
        'F-F-F-G': {x: 64, y: 144, w: 32, h: 18},
        'G-F-F-F': {x: 64, y: 162, w: 32, h: 18},
        'F-G-F-F': {x: 64, y: 180, w: 32, h: 18},
        
        'E-E-S-E': {x: 96, y: 18, w: 32, h: 18}, // Slab/Empty
        'E-S-S-E': {x: 96, y: 36, w: 32, h: 18},
        'E-E-S-S': {x: 96, y: 54, w: 32, h: 18},
        'E-S-S-S': {x: 96, y: 72, w: 32, h: 18},
        'E-E-E-S': {x: 128, y: 0, w: 32, h: 18},
        'S-S-E-E': {x: 128, y: 18, w: 32, h: 18},
        'S-E-E-E': {x: 160, y: 0, w: 32, h: 18},
        'S-E-E-S': {x: 160, y: 18, w: 32, h: 18},
        'E-S-E-E': {x: 192, y: 0, w: 32, h: 18},
        'S-S-E-S': {x: 192, y: 18, w: 32, h: 18},
        'E-S-E-S': {x: 224, y: 0, w: 32, h: 18},
        'S-E-S-S': {x: 224, y: 18, w: 32, h: 18},
        'S-S-S-E': {x: 224, y: 36, w: 32, h: 18},
        'S-E-S-E': {x: 224, y: 54, w: 32, h: 18}
    }
};

module.exports = Sheet;

function Sheet(spriteName) {
    this.map = JSON.parse(JSON.stringify(map[spriteName]));
}