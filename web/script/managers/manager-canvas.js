'use strict';
var Canvas = require('./../common/canvas');

var canvas, canvases, backgroundColor, scale;
var panStart = false, pan = { x: 0, y: 0 };

var canvasManager = {
    init: function(options) {
        backgroundColor = options.backgroundColor;
        canvases = [];
        for(var s = 1; s < 5; s++) {
            var newCanvas = new Canvas(1,1);
            newCanvas.canvas.canvasID = options.canvasID + s;
            document.body.appendChild(newCanvas.canvas);
            newCanvas.canvas.style.transform = 'scale(' + s + ', ' + s + ')';
            newCanvas.context.mozImageSmoothingEnabled = false;
            newCanvas.context.imageSmoothingEnabled = false;
            newCanvas.canvas.addEventListener("contextmenu", function(e) {
                e.preventDefault();
            });
            canvases.push(newCanvas);
        }
        setScale(options.initialScale);
        resize();
    },
    startPan: function(x,y) {
        if(panStart) return;
        panStart = { x: x, y: y };
    },
    onPan: function(x,y) {
        if(!panStart) return;
        pan.x += x - panStart.x;
        pan.y += y - panStart.y;
        panStart = { x: x, y: y };
    },
    stopPan: function() {
        panStart = false;
    },
    zoom: function(levelChange, x, y) {
        console.log('zoom',x,y);
        if(scale + levelChange < 1 || scale + levelChange > canvases.length) return;
        // console.log('panning',Math.round(x - (canvas.width / 2)) * levelChange,
        //     Math.round(y - (canvas.height / 2)) * levelChange);
        pan.x -= Math.round(x - (canvas.width / 2)) * levelChange;
        pan.y -= Math.round(y - (canvas.height / 2)) * levelChange;
        setScale(scale + levelChange);
    },
    pan: pan
};

module.exports = canvasManager;

function setScale(sc) {
    if(scale == sc) return;
    scale = sc;
    canvasManager.scale = scale;
    canvas = canvases[scale-1];
    canvasManager.canvas = canvas;
    canvas.canvas.style.zIndex = 10; // Bring active canvas above previously active canvas
    for(var s = 0; s < canvases.length; s++) {
        if(s+1 != scale) {
            canvases[s].canvas.style.zIndex = 1; // Send other canvases back
        }
    }
    canvas.canvas.style.zIndex = 5; // Lower active canvas to normal active zIndex
}

function resize() {
    for(var s = 0; s < canvases.length; s++) {
        canvases[s].setSize(Math.ceil(window.innerWidth / (s+1)), Math.ceil(window.innerHeight / (s+1)));
    }
}