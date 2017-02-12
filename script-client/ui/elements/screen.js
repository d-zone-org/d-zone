'use strict';
var inherits = require('inherits');
var Element = require('./../element');

module.exports = Screen;
inherits(Screen, Element);

function Screen(background) {
    Element.call(this,{});
    this.background = background;
}

Screen.prototype.drawSelf = function() {
    if(this.background) this.elementCanvas.fill(this.background);
};

Screen.prototype.mouseEvent = function(eventType, args) {
    this.toChildren(eventType, args);
};

Screen.prototype.getAbsolutePosition = function() {
    return { x: 0, y: 0 };
};

Screen.prototype.makeDirty = function() {
    this.dirty = true;
};

Screen.prototype.focusUI = function() {
    this.focus = true;
};

Screen.prototype.resize = function(width, height) {
    if(this.width === width && this.height === height) return;
    this.width = width;
    this.height = height;
    this.elementCanvas.setSize(width, height);
    this.makeDirty();
};