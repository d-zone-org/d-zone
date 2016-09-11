'use strict';
var InputManager = require('manager-input');
var UIManager = require('manager-ui');
var canvases = require('view-canvases');
var util = require('dz-util.js');

var view = {
    scale: 1,
    width: 1, height: 1,
    cursorX: 0, cursorY: 0,
    panX: 0, panY: 0
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
    onFrameReady: false
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
        panStart();
    }
});
InputManager.events.on('mouse-up',function (event) {
    if(!UIManager.mouseUp(view.cursorX, view.cursorY, event.button)) {
        panStop();
    }
});
InputManager.events.on('mouse-wheel',function (event) {
    if(!UIManager.mouseWheel(view.cursorX, view.cursorY, event.direction)) {
        zoom(event.direction == 'up' ? 1 : -1);
    }
});

function panStart() {
    if(panFrom) return;
    panFrom = { x: view.cursorX, y: view.cursorY };
}

function panMove() {
    if(!panFrom) return;
    view.panX += view.cursorX - panFrom.x;
    view.panY += view.cursorY - panFrom.y;
    panFrom = { x: view.cursorX, y: view.cursorY };
    // console.log('pan to', view.panX, view.panY);
}

function panStop() {
    panFrom = false;
}

function zoom(change) {
    if(view.scale + change < 1 || view.scale + change > view.maxScale) return;
    view.scale += change;
    view.canvas = canvases.getCanvas(view.scale);
    resize();
    waitForFrame(function() { // Don't switch canvases until new frame is ready to be drawn
        canvases.showCanvas(view.scale);
    });
    // console.log('panning',Math.round(x - (canvas.width / 2)) * levelChange,
    //     Math.round(y - (canvas.height / 2)) * levelChange);
    // pan.x -= Math.round(x - (canvas.width / 2)) * change;
    // pan.y -= Math.round(y - (canvas.height / 2)) * change;
}

function resize() {
    var newWidth = Math.ceil(window.innerWidth / (view.scale)),
        newHeight = Math.ceil(window.innerHeight / (view.scale));
    view.panX += Math.round((newWidth - view.width) / 2);
    view.panY += Math.round((newHeight - view.height) / 2);
    view.width = newWidth;
    view.height = newHeight;
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