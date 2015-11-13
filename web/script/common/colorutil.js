'use strict';

function applyAlpha(source, target) {
    var sourceData = source.getContext('2d').getImageData(0,0,source.width,source.height),
        targetCtx = target.getContext('2d'),
        targetData = targetCtx.getImageData(0,0,target.width,target.height);
    for(var p = 3; p < targetData.data.length; p += 4) {
        targetData.data[p] = sourceData.data[p];
    }
    targetCtx.putImageData(targetData,0,0);
}

module.exports = {
    colorize: function(img, color, amount) {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
        context.globalCompositeOperation = 'color';
        context.fillStyle = color;
        context.globalAlpha = amount;
        context.fillRect(0, 0, img.width, img.height);
        applyAlpha(img, canvas); // Restore original alpha channel
        return canvas;
    }
};