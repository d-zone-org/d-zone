'use strict';
var util = require('./../../common/util');
var Canvas = require('./../../common/canvas');

var tileWidth = 32, tileHeight = 18;

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
        var canvasMaxWidth = world.size * 32 + tileWidth,
            canvasMaxHeight = world.size * 16 + tileHeight;
        var drawXMin = canvasMaxWidth, drawXMax = 0,
            drawYMin = canvasMaxHeight, drawYMax = 0;
        var tempCanvas = new Canvas(canvasMaxWidth, canvasMaxHeight);
        world.tiles.forEachTileIntersection(function(nw,ne,se,sw,ix,iy){
            var shape = (nw & 1) | (ne & 1) << 1 | (se & 1) << 2 | (sw & 1) << 3, // 0-15
                ring = (nw + ne + se + sw) >> 2; // 0:ES, 1:SG, 2:GF, 3:F
            if(shape == 0 && ring == 0) return;
            var sheetXY = getTileSheetXY(ring,shape);
            var drawX = (ix - iy) * 16 + world.size * 16,
                drawY = (ix + iy) * 8;
            drawXMin = Math.min(drawX,drawXMin);
            drawXMax = Math.max(drawX+tileWidth,drawXMax);
            drawYMin = Math.min(drawY,drawYMin);
            drawYMax = Math.max(drawY+tileHeight,drawYMax);
            // console.log(nw,ne,se,sw,ring,shape,tileSheetXY);
            tempCanvas.drawImage(tileSheet,sheetXY.x,sheetXY.y,tileWidth,tileHeight,drawX,drawY);
        });
        var worldCanvas = new Canvas(drawXMax-drawXMin, drawYMax-drawYMin);
        worldCanvas.context.drawImage(tempCanvas.canvas,-drawXMin,-drawYMin);
        world.image = worldCanvas.canvas;
        world.imageCenter = { x: canvasMaxWidth/2 - drawXMin, y: canvasMaxHeight/2 - drawYMin };
    }
};