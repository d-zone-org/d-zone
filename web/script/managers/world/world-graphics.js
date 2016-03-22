'use strict';
var util = require('./../../common/util');
var geometry = require('./../../common/geometry');
var Map2D = require('./../../common/map2d');
var Map3D = require('./../../common/map3d');
var Canvas = require('./../../common/canvas');

// Tile order: NW, NE, SE, SW

const TILES = {
    'EMPTY':   0,
    'SLAB':    1,
    'GRASS':   2,
    'FLOWERS': 3
};

module.exports = {
    drawWorld: function(world) {
        var worldBounds = world.tiles.getBoundingBox();
        var worldWidth = worldBounds.x.max - worldBounds.x.min,
            worldHeight = worldBounds.y.max-worldBounds.y.min;
        // TODO: Tweak canvas size
        var worldCanvas = new Canvas(worldWidth*16, worldHeight*9);
        world.tiles.forEachTileIntersection(function(nw,ne,se,sw,ix,iy){
            var shape = (nw & 1) | (ne & 1) << 1 | (se & 1) << 2 | (sw & 1) << 3, // 0-15
                ring = (nw + ne + se + sw) >> 2; // 0-2 (empty-slab, slab-grass, grass-flowers)
            
        });
    }
};