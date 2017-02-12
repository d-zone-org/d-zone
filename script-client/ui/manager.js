'use strict';
var util = require('dz-util');
var InputManager = require('man-input');
var ViewManager = require('man-view');
var Canvas = require('canvas');
var Screen = require('./elements/screen');
var Button = require('./elements/button');
var Bubble = require('./elements/bubble');

var gameView = ViewManager.view;

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

gameView.events.on('view-change', function() {
    for(var s = 0; s < ui.screens.length; s++) {
        ui.screens[s].toChildren('gameViewChange', [gameView, ui]);
        ui.dirty = ui.dirty || ui.screens[s].dirty;
        ui.screens[s].dirty = false;
    }
    if(ui.dirty) draw();
    ui.dirty = false;
});

function mouseEvent(eventType, event) {
    ui.cursorX = Math.floor(event.x / ui.scale);
    ui.cursorY = Math.floor(event.y / ui.scale);
    var args = [ui.cursorX, ui.cursorY];
    if(eventType === 'mouseWheel') args.push(event.direction);
    else if(eventType === 'mouseMove') args.push(event.buttons);
    else args.push(event.button);
    for(var s = 0; s < ui.screens.length; s++) {
        ui.screens[s].mouseEvent(eventType, args);
        ui.dirty = ui.dirty || ui.screens[s].dirty;
        ui.focus = ui.focus || ui.screens[s].focus;
        ui.screens[s].dirty = false;
        ui.screens[s].focus = false;
    }
    if(ui.dirty) draw();
    if(!ui.focus) ViewManager[eventType](event);
    ui.dirty = false;
    ui.focus = false;
}

InputManager.events.on('mouse-move', function (event) { mouseEvent('mouseMove', event); });
InputManager.events.on('mouse-down', function (event) { mouseEvent('mouseDown', event); });
InputManager.events.on('mouse-up', function (event) { mouseEvent('mouseUp', event); });
InputManager.events.on('mouse-wheel', function (event) { mouseEvent('mouseWheel', event); });

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
        ui.screens[s].gameViewChange(gameView, ui.scale);
        ui.dirty = ui.dirty || ui.screens[s].dirty;
        ui.screens[s].dirty = false;
    }
    if(ui.dirty) draw();
    ui.dirty = false;
}

function addScreen() {
    var screen = new Screen();
    ui.screens.push(screen);
    return ui.screens.length - 1;
}

function addElement(element, screen, ...args) {
    var newElement = ui.screens[screen].addElement(new element(...args));
    draw();
    return newElement;
}

function removeElement(element) {
    util.removeFromArray(element, element.parentElement.childElements);
    draw();
}

module.exports = {
    init(options) {
        ui.maxScale = options.maxScale;
        ui.htmlCanvas.canvas.id = 'ui';
        ui.htmlCanvas.addToPage();
        var scale = calcScale(window.innerWidth, window.innerHeight);
        ui.cursorX = Math.floor(window.innerWidth / 2 / scale);
        ui.cursorY = Math.floor(window.innerHeight / 2 / scale);
        ui.width = Math.ceil(window.innerWidth / scale);
        ui.height = Math.floor(window.innerHeight / scale);
        zoom(scale); // Initial zoom
        window.addEventListener('resize', function() {
            var newScale = calcScale(window.innerWidth, window.innerHeight);
            if(newScale !== ui.scale) zoom(newScale);
            else resizeCanvas();
        });
    },
    addScreen,
    addButton(screen, ...args) {
        return addElement(Button, screen, ...args);
    },
    addBubble(screen, ...args) {
        return addElement(Bubble, screen, ...args, gameView, ui);
    },
    removeElement,
    htmlCanvas: ui.htmlCanvas
};

function calcScale(width, height) {
    var size = Math.min(width, height);
    return size < 400 ? 1 : size < 1000 ? 2 : 3;
}