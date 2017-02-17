'use strict';
var requestAnimationFrame = require('raf');
// var ViewManager = require('man-view');
var PIXI = require('pixi.js');
var Button = require('./elements/button');
// var Bubble = require('./elements/bubble');

// var gameView = ViewManager.view;

var ui = {
    container: new PIXI.Container(),
    scale: 1, width: 1, height: 1 // In game pixels
};

function draw() {
    ui.renderer.render(ui.container);
    requestAnimationFrame(draw);
}

function zoom(newScale) {
    if(newScale < 1 || newScale > ui.maxScale) return;
    ui.scale = newScale;
    resizeCanvas();
    ui.renderer.view.style.transform = 'scale(' + ui.scale + ', ' + ui.scale + ')';
}

function resizeCanvas() {
    ui.width = Math.ceil(window.innerWidth / ui.scale);
    ui.height = Math.ceil(window.innerHeight / ui.scale);
    ui.renderer.resize(ui.width, ui.height);
}

function addScreen() {
    return ui.container.addChild(new PIXI.Container());
}

function addElement(element, screen, ...args) {
    return screen.addChild(new element(...args));
}

function removeElement(element) {
    element.destroy();
}

module.exports = {
    init(options) {
        ui.maxScale = options.maxScale;
        var scale = calcScale(window.innerWidth, window.innerHeight);
        ui.width = Math.ceil(window.innerWidth / scale);
        ui.height = Math.floor(window.innerHeight / scale);
        ui.renderer = PIXI.autoDetectRenderer(ui.width, ui.height,
            { antialias: false, transparent: true });
        ui.renderer.view.id = 'ui';
        document.body.appendChild(ui.renderer.view);
        ui.renderer.view.addEventListener('contextmenu', function(e) { e.preventDefault(); });
        zoom(scale); // Initial zoom
        requestAnimationFrame(draw);
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
        return addElement(Bubble, screen, ...args, ui);
    },
    removeElement
};

function calcScale(width, height) {
    var size = Math.min(width, height);
    return size < 400 ? 1 : size < 1000 ? 2 : 3;
}

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