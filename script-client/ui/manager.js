'use strict';
var InputManager = require('man-input');
var ViewManager = require('man-view');
var Canvas = require('canvas');
var Screen = require('./elements/screen');
var Button = require('./elements/button');

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

var ui = {
    internalCanvas: new Canvas(1, 1),
    htmlCanvas: new Canvas(1, 1),
    scale: 1,
    width: 1, height: 1, // In game pixels
    cursorX: 0, cursorY: 0, // In game pixels
    screens: []
};

InputManager.events.on('mouse-move', function (event) {
    ui.cursorX = Math.floor(event.x / ui.scale);
    ui.cursorY = Math.floor(event.y / ui.scale);
    for(var s = 0; s < ui.screens.length; s++) {
        ui.screens[s].mouseMove(ui.cursorX, ui.cursorY);
    }
    ViewManager.mouseMove(event);
});
InputManager.events.on('mouse-down', function (event) {
    ViewManager.mouseDown(event);
});
InputManager.events.on('mouse-up', function (event) {
    ViewManager.mouseUp(event);
});
InputManager.events.on('mouse-wheel', function (event) {
    ViewManager.mouseWheel(event);
});

function draw() { // Draw internal UI canvas to HTML canvas, UI itself is only redrawn when it needs to be
    ui.internalCanvas.clear();
    ui.htmlCanvas.clear();
    for(var s = 0; s < ui.screens.length; s++) {
        ui.screens[s].draw(ui.internalCanvas);
    }
    ui.htmlCanvas.context.drawImage(ui.internalCanvas.canvas, 0, 0);
}

function zoom(newScale) {
    if(newScale < 1 || newScale > ui.maxScale) return;
    ui.scale = newScale;
    resizeCanvas();
    ui.htmlCanvas.canvas.style.transform = 'scale(' + ui.scale + ', ' + ui.scale + ')';
}

function resizeCanvas() {
    var newWidth = Math.ceil(window.innerWidth / ui.scale),
        newHeight = Math.ceil(window.innerHeight / ui.scale);
    ui.cursorX = Math.round(newWidth * (ui.cursorX / ui.width));
    ui.cursorY = Math.round(newHeight * (ui.cursorY / ui.height));
    ui.width = newWidth;
    ui.height = newHeight;
    ui.htmlCanvas.setSize(ui.width, ui.height);
    ui.internalCanvas.setSize(ui.width, ui.height);
    for(var s = 0; s < ui.screens.length; s++) {
        ui.screens[s].resize(ui.width, ui.height);
    }
    draw();
}

function addScreen() {
    var screen = new Screen(draw);
    ui.screens.push(screen);
    return screen;
}

module.exports = {
    init(options) {
        ui.maxScale = options.maxScale;
        ui.htmlCanvas.canvas.id = 'ui';
        ui.htmlCanvas.addToPage();
        ui.cursorX = Math.floor(window.innerWidth / 2 / options.initialScale);
        ui.cursorY = Math.floor(window.innerHeight / 2 / options.initialScale);
        ui.width = Math.ceil(window.innerWidth / options.initialScale);
        ui.height = Math.floor(window.innerHeight / options.initialScale);
        addScreen().addElement(new Button(5, 5, 50, 20, 'button'));
        zoom(options.initialScale); // Initial zoom
        window.addEventListener('resize', resizeCanvas);
    },
    mouseMove(x, y) {

    },
    mouseDown(x, y, button) {

    },
    mouseUp(x, y, button) {

    },
    mouseWheel(x, y, dir) {

    },
    htmlCanvas: ui.htmlCanvas
};