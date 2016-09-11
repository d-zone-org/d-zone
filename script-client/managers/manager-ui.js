'use strict';
var InputManager = require('manager-input');
var ViewManager = require('manager-view');
var Canvas = require('canvas');
var Screen = require('ui-screen');

var uiCanvas = new Canvas(1,1);

var screens = [new Screen(ViewManager.view)];

// CanvasManager.events.on('canvas-update', function(c,s) {
//     scale = s;
//     screenSize.width = c.width;
//     screenSize.height = c.height;
//     uiCanvas.setSize(c.width, c.height);
//     redraw();
// });

function redraw() {
    uiCanvas.clear();
    screens.forEach(function(scr) {
        scr.draw(uiCanvas);
    });
}

module.exports = {
    draw: function(canvas) {
        // Draw internal UI canvas to main canvas, UI itself is only redrawn when it needs to be
        // Possible enhancement: separate the UI canvas in the html
        canvas.context.drawImage(uiCanvas.canvas,0,0);
    },
    mouseMove: function(x, y) {
        
    },
    mouseDown: function(x, y, button) {
        
    },
    mouseUp: function(x, y, button) {

    },
    mouseWheel: function(x, y, dir) {

    }
};