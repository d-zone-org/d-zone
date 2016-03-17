'use strict';
var EventEmitter = require('events').EventEmitter;
var Canvas = require('./../common/canvas');

var renderSystem,
    canvasID, canvas, canvases, context,
    backgroundColor, scale, width, height, halfWidth, halfHeight;

var events = new EventEmitter();

var canvasManager = {
    init: function(options) {
        renderSystem = options.renderSystem;
        canvasID = options.canvasID;
        backgroundColor = options.backgroundColor;
        scale = options.initialScale;
        canvases = [];
        for(var s = 1; s < 5; s++) {
            var newCanvas = new Canvas(1,1);
            newCanvas.canvas.canvasID = canvasID + s;
            document.body.appendChild(newCanvas.canvas);
            newCanvas.canvas.style.transform = 'scale(' + s + ', ' + s + ')';
            newCanvas.context.mozImageSmoothingEnabled = false;
            newCanvas.context.imageSmoothingEnabled = false;
            newCanvas.canvas.addEventListener("contextmenu", function(e) {
                e.preventDefault();
            });
            canvases.push(newCanvas);
        }
        onZoom();
        onResize();
    },
    events: events
};

function onZoom() {
    for(var s = 0; s < canvases.length; s++) {
        if(s+1 == scale) {
            canvases[s].canvas.style.zIndex = 5;
            canvas = canvases[s];
            context = canvas.context;
            renderSystem.setCanvas(canvas);
        } else {
            canvases[s].canvas.style.zIndex = 1;
        }
    }
}

function onResize() {
    width = canvas.canvas.width = Math.ceil(window.innerWidth / scale);
    height = canvas.canvas.height = Math.ceil(window.innerHeight / scale);
    halfWidth = Math.round(width/2);
    halfHeight = Math.round(height/2);
    renderSystem.updateCanvasSize(width,height);
    events.emit('resize',{ scale: scale, width: width, height: height });
}

module.exports = canvasManager;