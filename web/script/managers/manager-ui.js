'use strict';
var InputManager = require('./manager-input');
var CanvasManager = require('./manager-canvas');
var Canvas = require('./../common/canvas');
var Screen = require('./ui/ui-screen');

var uiCanvas = new Canvas(1,1);

var screenSize = { width: 1, height: 1 }, scale;
var screens = [new Screen(screenSize)];

CanvasManager.events.on('canvas-update', function(c,s) {
    scale = s;
    screenSize.width = c.width;
    screenSize.height = c.height;
    uiCanvas.setSize(c.width, c.height);
    redraw();
});

// Only top screens reacts to input
InputManager.events.on('mouse-move',function (event) {
    var x = Math.floor(event.x / scale),
        y = Math.floor(event.y / scale);
    if(!screens[screens.length-1].onMouseMove(x, y) && event.buttons) {
        CanvasManager.onPan(x,y);
    } else {
        CanvasManager.stopPan();
    }
});
InputManager.events.on('mouse-down',function (event) {
    var x = Math.floor(event.x / scale),
        y = Math.floor(event.y / scale);
    if(!screens[screens.length-1].onMouseDown(x, y, event.button)) {
        CanvasManager.startPan(x,y);
    }
});
InputManager.events.on('mouse-up',function (event) {
    var x = Math.floor(event.x / scale),
        y = Math.floor(event.y / scale);
    screens[screens.length-1].onMouseUp(x, y, event.button);
    CanvasManager.stopPan();
});
InputManager.events.on('mouse-wheel',function (event) {
    var x = Math.floor(event.x / scale),
        y = Math.floor(event.y / scale);
    if(!screens[screens.length-1].onMouseWheel(x, y, event.direction)) {
        CanvasManager.zoom(event.direction == 'up' ? 1 : -1, x, y);
    }
});

function redraw() {
    uiCanvas.clear();
    screens.forEach(function(scr) {
        scr.draw(uiCanvas);
    });
}

module.exports = {
    draw: function(canvas) {
        // Draw internal UI canvas to main canvas, UI itself is only redrawn when it needs to be
        // Optionally, separate the UI canvas in the html
        canvas.context.drawImage(uiCanvas.canvas,0,0);
    }
};