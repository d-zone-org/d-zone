'use strict';
var inherits = require('inherits');
var Element = require('./../element');
var Button = require('./button');

module.exports = Screen;
inherits(Screen,Element);

function Screen(uiDraw, background) {
    Element.call(this,{});
    this.uiDraw = uiDraw;
    this.background = background;
}

Screen.prototype.drawSelf = function() {
    if(this.background) this.elementCanvas.fill(this.background);
};

Screen.prototype.mouseEvent = function(eventType, args) {
    this.toChildren(eventType, args);
    if(this.dirty) this.uiDraw();
    this.dirty = false;
};

Screen.prototype.getAbsolutePosition = function() {
    return { x: 0, y: 0 };
};

Screen.prototype.makeDirty = function() {
    this.dirty = true;
};

Screen.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;
    this.elementCanvas.setSize(width, height);
};

Screen.prototype.addButton = function(x, y, w, h, text, onClick) {
    this.addElement(new Button(x, y, w, h, text, onClick));
};