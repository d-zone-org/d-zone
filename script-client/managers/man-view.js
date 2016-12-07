'use strict';
var Canvas = require('canvas');
var util = require('dz-util.js');

var view = {
    canvas: new Canvas(1, 1), scale: 1,
    width: 1, height: 1, // In game pixels
    cursorX: 0, cursorY: 0, // In game pixels
    centerX: 0, centerY: 0, // World image coords in the center of the window
    panX: 0, panY: 0 // Offset of world image in view
};

var panFrom = false;

var viewManager = {
    init(options) {
        view.maxScale = options.maxScale;
        view.id = options.id;
        view.canvas.canvas.id = view.id;
        view.canvas.addToPage(true); // Under UI canvas
        view.cursorX = Math.floor(window.innerWidth / 2 / options.initialScale);
        view.cursorY = Math.floor(window.innerHeight / 2 / options.initialScale);
        view.width = Math.ceil(window.innerWidth / options.initialScale);
        view.height = Math.floor(window.innerHeight / options.initialScale);
        zoom(options.initialScale, true); // Initial zoom
        require('sys-render').onViewReady();
        window.addEventListener('resize', function() {
            fitWindow();
            resizeCanvas();
        });
    },
    view: view,
    onFrameReady: false,
    setCenter(x, y) {
        view.centerX = Math.round(x);
        view.centerY = Math.round(y);
        if(view.id) calcPan(); // Only pan if view is initialized
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
    view.panX = Math.round(view.centerX - view.width / 2);
    view.panY = Math.round(view.centerY - view.height / 2);
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