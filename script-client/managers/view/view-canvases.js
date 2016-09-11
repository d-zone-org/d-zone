'use strict';
var Canvas = require('canvas');

var canvas, canvases = [];

module.exports = {
    init: function(view) {
        for(var s = 1; s <= view.maxScale; s++) {
            var newCanvas = new Canvas(1, 1);
            newCanvas.canvas.canvasID = view.id + s;
            document.body.appendChild(newCanvas.canvas);
            newCanvas.canvas.style.transform = 'scale(' + s + ', ' + s + ')';
            newCanvas.context.mozImageSmoothingEnabled = false;
            newCanvas.context.imageSmoothingEnabled = false;
            newCanvas.canvas.addEventListener('contextmenu', function(e) {
                e.preventDefault();
            });
            canvases.push(newCanvas);
        }
    },
    getCanvas: function(scale) {
        return canvases[scale-1];
    },
    setSize: function(width, height) {
        for(var s = 0; s < canvases.length; s++) {
            canvases[s].setSize(Math.ceil(width / (s+1)), Math.ceil(height / (s+1)));
        }
    },
    showCanvas: function(scale) {
        canvases[scale-1].canvas.style.zIndex = 3; // Bring active canvas above previously active canvas
        for(var s = 0; s < canvases.length; s++) {
            if(s+1 != scale) {
                canvases[s].canvas.style.zIndex = 1; // Send other canvases back
            }
        }
        canvases[scale-1].canvas.style.zIndex = 2; // Lower active canvas to normal active zIndex
    }
};