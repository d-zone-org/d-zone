'use strict';
var InputManager = require('man-input');
var ViewManager = require('man-view');
var Canvas = require('canvas');
var Screen = require('ui/screen');

var uiCanvas = new Canvas(1, 1);

var screens = [new Screen(ViewManager.view)];

/* TODO: Implement UI building like this:
var testWindow = UIManager.addWindow()
    .setPosition(20,20)
    .setSize(100,200);
var testButton = testWindow.addButton()
    .setPosition(10,10)
    .setSize(30,10)
    .setText('Click!')
    .onClick(someFunction);
*/

function redraw() {
    uiCanvas.clear();
    for(var i = 0; i < screens.length; i++) {
        screens[i].draw(uiCanvas);
    }
}

module.exports = {
    draw(canvas) {
        // Draw internal UI canvas to main canvas, UI itself is only redrawn when it needs to be
        // Possible enhancement: separate the UI canvas in the html
        canvas.context.drawImage(uiCanvas.canvas, 0, 0);
    },
    mouseMove(x, y) {
        
    },
    mouseDown(x, y, button) {
        
    },
    mouseUp(x, y, button) {

    },
    mouseWheel(x, y, dir) {

    }
};