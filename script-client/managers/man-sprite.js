'use strict';
var TextureManager = require('man-texture');
var PIXI = require('pixi.js');

var sprites = {};

var spriteManager = {
    getColorSheet
};

var colorMatrix = new PIXI.filters.ColorMatrixFilter();
colorMatrix.matrix = [
//  R    G    B    A   Offset  
    1.0, 0.0, 0.0, 0.0, 0, // R
    0.0, 1.0, 0.0, 0.0, 0, // G
    0.0, 0.0, 1.0, 0.0, 0, // B
    0.0, 0.0, 0.0, 1.0, 0  // A
];

function getColorSheet(sheet, color, alpha, regions) {
    var hex = '#' + ('00000' + color.toString(16)).substr(-6);
    var sheetName = sheet + hex;
    this.waitForLoaded(function() {
        if(!sheets[sheetName]) {
            regions = regions || [];
            var canvas = document.createElement('canvas');
            canvas.width = sheets[sheet].width;
            canvas.height = sheets[sheet].height;
            var context = canvas.getContext('2d');
            context.drawImage(sheets[sheet], 0, 0);
            context.globalCompositeOperation = 'color';
            var colorCanvas = document.createElement('canvas');
            colorCanvas.width = canvas.width;
            colorCanvas.height = canvas.height;
            var colorContext = colorCanvas.getContext('2d');
            colorContext.fillStyle = hex;
            colorContext.globalAlpha = alpha;
            colorContext.fillRect(0, 0, canvas.width, canvas.height);
            for(var i = 0; i < regions.length; i++) {
                var region = regions[i];
                colorContext.clearRect(region.x, region.y, region.w, region.h);
                colorContext.fillStyle = region.color ? region.color : hex;
                colorContext.globalAlpha = region.alpha ? region.alpha : alpha;
                colorContext.fillRect(region.x, region.y, region.w, region.h);
            }
            context.drawImage(colorCanvas, 0, 0);
            applyAlpha(sheets[sheet], canvas); // Restore original alpha channel
            sheets[sheetName] = canvas;
        }
    });
    return sheetName;
}

function applyAlpha(source, target) { // Overwrite target's alpha map with source's
    var sourceData = source.getContext('2d').getImageData(0, 0, source.width, source.height),
        targetCtx = target.getContext('2d'),
        targetData = targetCtx.getImageData(0,0, target.width, target.height);
    for(var p = 3; p < targetData.data.length; p += 4) {
        targetData.data[p] = sourceData.data[p];
    }
    targetCtx.putImageData(targetData, 0, 0);
}

module.exports = spriteManager;