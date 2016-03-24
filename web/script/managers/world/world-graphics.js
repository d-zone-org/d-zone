'use strict';
var util = require('./../../common/util');
var Canvas = require('./../../common/canvas');

function getTileSheetXY(ring,shape) {
    if(ring & 1) { // Reverse shape for odd ring numbers
        shape = shape ^ 15;
    }
    if(ring == 2 && shape == 0) { // Grass variation
        ring = 4;
        shape = util.randomIntRange(0,2);
        var random = Math.random();
        if(random > 0.98) shape = 8;
        else if(random > 0.95) shape = util.randomIntRange(5,7);
        else if(random > 0.6) shape = util.randomIntRange(3,4);
    }
    return { x: shape * 32, y: ring * 18 };
}

module.exports = {
    drawWorld: function(world, sprites) {
        var tileSheet = sprites['static-tiles'];
        var worldBounds = world.tiles.getBoundingBox();
        var worldWidth = worldBounds.x.max - worldBounds.x.min,
            worldHeight = worldBounds.y.max-worldBounds.y.min;
        // TODO: Tweak canvas size
        var worldCanvas = new Canvas(worldWidth*32, worldHeight*18);
        world.tiles.forEachTileIntersection(function(nw,ne,se,sw,ix,iy){
            var shape = (nw & 1) | (ne & 1) << 1 | (se & 1) << 2 | (sw & 1) << 3, // 0-15
                ring = (nw + ne + se + sw) >> 2; // 0:ES, 1:SG, 2:GF, 3:F
            if(shape == 0 && ring == 0) return;
            var tileSheetXY = getTileSheetXY(ring,shape);
            var drawX = (ix - iy) * 16 + 320,
                drawY = (ix + iy) * 8 - 48;
            // console.log(nw,ne,se,sw,ring,shape,tileSheetXY);
            worldCanvas.drawImage(tileSheet,tileSheetXY.x,tileSheetXY.y,32,18,drawX,drawY,32,18);
        });
        return worldCanvas.canvas;
    }
};