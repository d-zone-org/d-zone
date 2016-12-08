'use strict';
var Canvas = require('canvas');

module.exports = Element;

function Element(options) {
    if(options.parent) this.parentElement = options.parent;
    this.x = options.x || 0; // Position relative to parent
    this.y = options.y || 0;
    this.width = options.width || 1;
    this.height = options.height || 1;
    this.elementCanvas = new Canvas(this.width, this.height); // Canvas to draw self
    this.childElements = [];
    this.canvasMargin = { top: 0, bottom: 0, left: 0, right: 0 };
    this.hoverMargin = { top: 0, bottom: 0, left: 0, right: 0 };
    this.hoverState = options.hoverState;
}

Element.prototype.addElement = function(element) {
    element.parentElement = this;
    this.childElements.push(element);
};

Element.prototype.draw = function(canvas) {
    this.drawSelf();
    canvas.context.drawImage(this.elementCanvas.canvas, this.x, this.y);
    for(var i = 0; i < this.childElements.length; i++) {
        this.childElements[i].draw(canvas);
    }
};

Element.prototype.mouseMove = function(x, y) {
    var absPos = this.getAbsolutePosition();
    this.hover = x >= absPos.x - this.hoverMargin.left
        && x < absPos.x + this.width + this.hoverMargin.right
        && y >= absPos.y - this.hoverMargin.top
        && y < absPos.y + this.height + this.hoverMargin.bottom;
    if(this.hoverState && this.hover !== this.lastHover) this.makeDirty();
    this.lastHover = this.hover;
    for(var i = 0; i < this.childElements.length; i++) {
        this.childElements[i].mouseMove(x, y);
    }
};

Element.prototype.makeDirty = function() {
    this.parentElement.makeDirty();
};

Element.prototype.mouseDown = function(x, y, button) {
    
};

Element.prototype.mouseUp = function(x, y, button) {

};

Element.prototype.mouseWheel = function(x, y, direction) {

};

Element.prototype.getAbsolutePosition = function() { // Position on screen
    var parentAbsolute = this.parentElement.getAbsolutePosition();
    return { x: parentAbsolute.x + this.x, y: parentAbsolute.y + this.y };
};

Element.prototype.drawSelf = function() { }; // Virtual