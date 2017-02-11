'use strict';
var Canvas = require('canvas');
var util = require('dz-util.js');

var view = {
    canvas: new Canvas(1, 1), scale: 1,
    width: 1, height: 1, // In game pixels
    cursorX: 0, cursorY: 0, // In game pixels
    centerX: 0, centerY: 0, // World image coords in the center of the window
    panX: 0, panY: 0, // Offset of world image in view
    events: new (require('events').EventEmitter)()
};

var panFrom = false;

var viewManager = {
    init(options) {
        view.maxScale = options.maxScale;
        view.id = options.id;
        view.canvas.canvas.id = view.id;
        view.canvas.addToPage(true); // Under UI canvas
        var windowSize = Math.min(window.innerWidth, window.innerHeight);
        var scale = windowSize < 400 ? 1 : windowSize < 800 ? 2 : windowSize < 1200 ? 3 : 4;
        view.cursorX = Math.floor(window.innerWidth / 2 / scale);
        view.cursorY = Math.floor(window.innerHeight / 2 / scale);
        view.width = Math.ceil(window.innerWidth / scale);
        view.height = Math.floor(window.innerHeight / scale);
        zoom(scale, true); // Initial zoom
        view.events.emit('ready');
        window.addEventListener('resize', function() {
            fitWindow();
            resizeCanvas();
        });
    },
    view: view,
    onFrameReady: false,
    setOrigin(x, y) {
        view.originX = Math.round(x);
        view.originY = Math.round(y);
        view.centerX = view.originX;
        view.centerY = view.originY;
        calcPan();
    },
    mouseMove(event) {
        view.cursorX = Math.floor(event.x / view.scale);
        view.cursorY = Math.floor(event.y / view.scale);
        panMove();
    },
    mouseDown(event) {
        panFrom = panFrom || { x: view.cursorX, y: view.cursorY };
    },
    mouseUp(event) {
        panFrom = false;
    },
    mouseWheel(event) {
        zoom(view.scale + (event.direction == 'up' ? 1 : -1));
    }
};

function panMove() {
    if(!panFrom) return;
    view.centerX -= view.cursorX - panFrom.x;
    view.centerY -= view.cursorY - panFrom.y;
    calcPan();
    panFrom = { x: view.cursorX, y: view.cursorY };
}

function calcPan() {
    view.centerX = Math.max(-view.width / 2, Math.min(view.originX * 2 + view.width / 2, view.centerX));
    view.centerY = Math.max(-view.height / 2, Math.min(view.originY * 2 + view.height / 2, view.centerY));
    view.panX = Math.round(view.centerX - view.width / 2);
    view.panY = Math.round(view.centerY - view.height / 2);
    view.events.emit('view-change');
}

function zoom(newScale, init) {
    if(newScale < 1 || newScale > view.maxScale) return;
    view.scale = newScale;
    var cursorWorldX = view.panX + view.cursorX,
        cursorWorldY = view.panY + view.cursorY;
    fitWindow();
    if(!init) { // If not initial zoom
        view.centerX += cursorWorldX - (view.panX + view.cursorX); // Consistent cursor-world location
        view.centerY += cursorWorldY - (view.panY + view.cursorY);
    }
    calcPan();
    resizeCanvas();
}

function fitWindow() {
    var newWidth = Math.ceil(window.innerWidth / view.scale),
        newHeight = Math.ceil(window.innerHeight / view.scale);
    view.cursorX = Math.round(newWidth * (view.cursorX / view.width));
    view.cursorY = Math.round(newHeight * (view.cursorY / view.height));
    view.width = newWidth;
    view.height = newHeight;
    calcPan();
}

function resizeCanvas() {
    viewManager.onFrameReady = function() { // Wait until new frame is ready to be drawn
        view.canvas.canvas.style.transform = 'scale(' + view.scale + ', ' + view.scale + ')';
        view.canvas.setSize(view.width, view.height);
        viewManager.onFrameReady = false;
    };
}

module.exports = viewManager;