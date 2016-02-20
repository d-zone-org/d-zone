'use strict';
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var BetterCanvas = require('./../common/bettercanvas.js');
var TextBlotter = require('./../common/textblotter.js');
var Button = require('./button.js');
var Panel = require('./panel.js');
var Input = require('./input.js');
var Label = require('./label.js');

module.exports = UI;
inherits(UI, EventEmitter);

function UI(game) {
    this.game = game;
    TextBlotter.loadImage(this.game.renderer.images.font);
    this.game.on('resize', this.onResize.bind(this));
    this.game.on('mousemove', this.onMouseMove.bind(this));
    this.game.on('mousedown', this.onMouseDown.bind(this));
    this.game.on('mouseup', this.onMouseUp.bind(this));
    this.game.on('keydown', this.onKeyDown.bind(this));
    this.game.on('keyup', this.onKeyUp.bind(this));
    this.elements = [];
    this.x = 0; this.y = 0;
    this.canvas = new BetterCanvas(1,1);
    var self = this;
    this.on('draw', function(canvas) { canvas.drawStatic(self.canvas.canvas); });
    this.boundRedraw = this.redraw.bind(this);
    this.boundOnMouseOnElement = this.onMouseOnElement.bind(this);
    this.boundOnMouseOffElement = this.onMouseOffElement.bind(this);
}

// TODO: Abstract these different add methods into one
UI.prototype.addButton = function(options) {
    if(!options.parent) options.parent = this;
    options.ui = this;
    var newButton = new Button(options);
    options.parent.elements.push(newButton);
    if(options.parent !== this) this.elements.push(newButton);
    newButton.on('redraw', this.boundRedraw);
    newButton.on('mouse-on-element', this.boundOnMouseOnElement);
    newButton.on('mouse-off-element', this.boundOnMouseOffElement);
    return newButton;
};

UI.prototype.addPanel = function(options) {
    if(!options.parent) options.parent = this;
    options.ui = this;
    var newPanel = new Panel(options);
    options.parent.elements.push(newPanel);
    if(options.parent !== this) this.elements.push(newPanel);
    newPanel.on('redraw', this.boundRedraw);
    return newPanel;
};

UI.prototype.addInput = function(options) {
    if(!options.parent) options.parent = this;
    options.ui = this;
    var newInput = new Input(options);
    options.parent.elements.push(newInput);
    if(options.parent !== this) this.elements.push(newInput);
    newInput.on('redraw', this.boundRedraw);
    newInput.on('mouse-on-element', this.boundOnMouseOnElement);
    newInput.on('mouse-off-element', this.boundOnMouseOffElement);
    return newInput;
};

UI.prototype.addLabel = function(options) {
    if(!options.parent) options.parent = this;
    options.ui = this;
    var newLabel = new Label(options);
    options.parent.elements.push(newLabel);
    if(options.parent !== this) this.elements.push(newLabel);
    newLabel.on('redraw', this.boundRedraw);
    newLabel.on('mouse-on-element', this.boundOnMouseOnElement);
    newLabel.on('mouse-off-element', this.boundOnMouseOffElement);
    return newLabel;
};

UI.prototype.redraw = function() {
    this.canvas.clear();
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].redraw(this.canvas);
    }
};

UI.prototype.onMouseMove = function(mouseEvent) {
    if(this.game.mouseButtons.length > 0) return;
    for(var i = 0; i < this.elements.length; i++) {
        var elem = this.elements[i];
        if(mouseEvent.x >= elem.x && mouseEvent.x < elem.x + elem.w
            && mouseEvent.y >= elem.y && mouseEvent.y < elem.y + elem.h) {
            elem.emit('mouse-on', mouseEvent);
        } else {
            elem.emit('mouse-off', mouseEvent);
        }
    }
};

UI.prototype.onMouseDown = function(mouseEvent) {
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].emit('mouse-down', mouseEvent);
    }
};

UI.prototype.onMouseUp = function(mouseEvent) {
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].emit('mouse-up', mouseEvent);
    }
};

UI.prototype.onKeyDown = function(keyEvent) {
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].emit('key-down', keyEvent);
    }
};

UI.prototype.onKeyUp = function(keyEvent) {
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].emit('key-up', keyEvent);
    }
};

UI.prototype.onMouseOnElement = function(elem) {
    this.mouseOnElement = elem;
    this.game.mouseOver = false;
};

UI.prototype.onMouseOffElement = function(elem) {
    this.mouseOnElement = this.mouseOnElement === elem ? false : this.mouseOnElement;
};

UI.prototype.onResize = function(resize) {
    this.w = resize.width; this.h = resize.height;
    this.canvas.canvas.width = this.w;
    this.canvas.canvas.height = this.h;
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].reposition();
    }
    this.redraw();
};