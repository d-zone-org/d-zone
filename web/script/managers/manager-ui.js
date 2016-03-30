'use strict';
var Canvas = require('./../common/canvas');
var Screen = require('./ui/ui-screen');

var uiCanvas = new Canvas(1,1);

// Listen to InputManager events to update UI

var screenSize = { width: 1, height: 1 };
var screens = [new Screen(screenSize)];

function redraw() {
    uiCanvas.clear();
    screens.forEach(function(scr) {
        scr.draw(uiCanvas);
    });
}

function onMouseMove() {
    screens[screens.length-1].onMouseMove(x, y); // Only top screen reacts to mouse
}

module.exports = {
    draw: function(canvas) {
        // Draw internal UI canvas to main canvas, UI itself is only redrawn when it needs to be
        // Optionally, separate the UI canvas in the html
    },
    resize: function(w, h) {
        screenSize.width = w;
        screenSize.height = h;
        uiCanvas.setSize(w, h);
        redraw();
    }
};