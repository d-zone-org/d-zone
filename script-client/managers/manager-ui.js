'use strict';
var InputManager = require('manager-input');
var ViewManager = require('manager-view');
var Canvas = require('canvas');
var Screen = require('ui-screen');

var uiCanvas = new Canvas(1,1);

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