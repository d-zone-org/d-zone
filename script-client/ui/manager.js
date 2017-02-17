'use strict';
var requestAnimationFrame = require('raf');
var InputManager = require('man-input');
var ViewManager = require('man-view');
var PIXI = require('pixi.js');
var Button = require('./elements/button');
// var Bubble = require('./elements/bubble');

// var gameView = ViewManager.view;

var ui = {
    renderer: PIXI.autoDetectRenderer(1, 1, { antialias: false, transparent: true }),
    container: new PIXI.Container(),
    scale: 1, width: 1, height: 1 // In game pixels
};
ui.container.hitArea = new PIXI.Rectangle(0, 0, 1, 1);
InputManager.init(ui.container);

// var renderTime = 0, frameCount = 0;
function draw() {
    // frameCount++;
    // var renderStart = performance.now();
    ui.renderer.render(ui.container);
    // renderTime += performance.now() - renderStart;
    // if(frameCount == 500) { frameCount = 0; console.log('avg ui render time',renderTime/500); renderTime = 0; }
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
    ui.container.hitArea.width = ui.width;
    ui.container.hitArea.height = ui.height;
}

function addElement(element, ...args) {
    return ui.container.addChild(new element(...args));
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
        InputManager.events.on('mouse-down',function(e){
            for(var i = 0; i < ui.container.children.length; i++) {
                if(ui.container.children[i].isEventCaptured(e)) return;
            }
            ViewManager.mouseDown(e);
        });
        InputManager.events.on('mouse-up', ViewManager.mouseUp);
        InputManager.events.on('mouse-move', ViewManager.mouseMove);
        InputManager.events.on('mouse-wheel', ViewManager.mouseWheel);
    },
    addButton(...args) {
        return addElement(Button, ...args);
    },
    addBubble(...args) {
        return addElement(Bubble, ...args, ui);
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