'use strict';
var InputManager = require('manager-input');
var UIManager = require('manager-ui');
var canvases = require('view-canvases');
var util = require('dz-util.js');

var view = {
    scale: 1,
    width: 1, height: 1, // In game pixels
    cursorX: 0, cursorY: 0, // In game pixels
    centerX: 0, centerY: 0, // World image coords in the center of the window
    panX: 0, panY: 0 // Offset of world image in view
};

var panFrom = false;

var viewManager = {
    init: function(options) {
        view.maxScale = options.maxScale;
        view.id = options.id;
        canvases.init(view);
        zoom(options.initialScale - view.scale);
        canvases.setSize(window.innerWidth, window.innerHeight);
    },
    view: view,
    onFrameReady: false,
    setCenter: function(x, y) {
        view.centerX = Math.round(x);
        view.centerY = Math.round(y);
        calcPan();
    }
};

InputManager.events.on('mouse-move',function (event) {
    view.cursorX = Math.floor(event.x / view.scale);
    view.cursorY = Math.floor(event.y / view.scale);
    if(!UIManager.mouseMove(view.cursorX, view.cursorY)) {
        panMove();
    }
});
InputManager.events.on('mouse-down',function (event) {
    if(!UIManager.mouseDown(view.cursorX, view.cursorY, event.button)) {
        panFrom = panFrom || { x: view.cursorX, y: view.cursorY };
    }
});
InputManager.events.on('mouse-up',function (event) {
    if(!UIManager.mouseUp(view.cursorX, view.cursorY, event.button)) {
        panFrom = false;
    }
});
InputManager.events.on('mouse-wheel',function (event) {
    if(!UIManager.mouseWheel(view.cursorX, view.cursorY, event.direction)) {
        zoom(event.direction == 'up' ? 1 : -1);
    }
});

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

function zoom(change) {
    if(view.scale + change < 1 || view.scale + change > view.maxScale) return;
    view.scale += change;
    view.canvas = canvases.getCanvas(view.scale);
    var cursorWorldX = view.panX + view.cursorX,
        cursorWorldY = view.panY + view.cursorY;
    resize();
    view.centerX += cursorWorldX - (view.panX + view.cursorX); // Consistent cursor-world location
    view.centerY += cursorWorldY - (view.panY + view.cursorY);
    calcPan();
    waitForFrame(function() { // Don't switch canvases until new frame is ready to be drawn
        canvases.showCanvas(view.scale);
    });
}

function resize() {
    var newWidth = Math.ceil(window.innerWidth / (view.scale)),
        newHeight = Math.ceil(window.innerHeight / (view.scale));
    view.cursorX = Math.round(newWidth * (view.cursorX / view.width));
    view.cursorY = Math.round(newHeight * (view.cursorY / view.height));
    view.width = newWidth;
    view.height = newHeight;
    calcPan();
}

window.addEventListener('resize', function() {
    resize();
    waitForFrame(function() { // Don't resize canvas until new frame is ready to be drawn
        canvases.setSize(window.innerWidth, window.innerHeight);
    });
});

function waitForFrame(callback) {
    viewManager.onFrameReady = function() { // Called by render system
        callback();
        viewManager.onFrameReady = false;
    };
}

module.exports = viewManager;