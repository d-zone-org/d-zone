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
    colorize: function(options) {
        var canvas = document.createElement('canvas');
        canvas.width = options.image.width;
        canvas.height = options.image.height;
        var context = canvas.getContext('2d');
        context.drawImage(options.image, 0, 0, options.image.width, options.image.height,
            0, 0, options.image.width, options.image.height);
        context.globalCompositeOperation = 'color';
        var colorCanvas = document.createElement('canvas');
        colorCanvas.width = options.image.width;
        colorCanvas.height = options.image.height;
        var colorContext = colorCanvas.getContext('2d');
        colorContext.fillStyle = options.color;
        colorContext.globalAlpha = options.alpha;
        colorContext.fillRect(0, 0, options.image.width, options.image.height);
        if(options.regions) { // Paint custom regions if specified
            for(var i = 0; i < options.regions.length; i++) {
                var reg = options.regions[i];
                colorContext.clearRect(reg.x, reg.y, reg.w, reg.h);
                colorContext.fillStyle = reg.color ? reg.color : options.color;
                colorContext.globalAlpha = reg.alpha ? reg.alpha : options.alpha;
                colorContext.fillRect(reg.x, reg.y, reg.w, reg.h);
            }
        }
        context.drawImage(colorCanvas,0,0);
        applyAlpha(options.image, canvas); // Restore original alpha channel
        return canvas;
    },
    interpolateRGBA: function(RGBA1, RGBA2, amount) {
        var RGBA1Split = RGBA1.substring(5,RGBA1.length-2).split(',');
        var r1 = +RGBA1Split[0], g1 = +RGBA1Split[1], b1 = +RGBA1Split[2], a1 = +RGBA1Split[3];
        var RGBA2Split = RGBA2.substring(5,RGBA2.length-2).split(',');
        var r2 = +RGBA2Split[0], g2 = +RGBA2Split[1], b2 = +RGBA2Split[2], a2 = +RGBA2Split[3];
        var interpolated = [Math.round((r1+(r2-r1)*amount)),Math.round((g1+(g2-g1)*amount)),
            Math.round((b1+(b2-b1)*amount)),(a1+(a2-a1)*amount)];
        return 'rgba(' + interpolated.join(',') + ')';
    }
};