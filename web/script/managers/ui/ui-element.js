'use strict';
var Canvas = require('./../../common/canvas');

module.exports = UIElement;

function UIElement(options) {
    if(options.parent) this.parentElement = options.parent;
    this.relX = options.relX || 0; // Position relative to parent
    this.relY = options.relY || 0;
    this.size = { width: options.width || 1, height: options.height || 1 };
    this.elementCanvas = new Canvas(1,1); // Canvas to draw self
    this.childElements = [];
    this.canvasMargin = { top: 0, bottom: 0, left: 0, right: 0 };
    this.hoverMargin = { top: 0, bottom: 0, left: 0, right: 0 };
}

UIElement.prototype.draw = function(canvas) {
    canvas.context.drawImage(this.elementCanvas.canvas,this.relX,this.relY);
    this.childElements.forEach(function(child) {
        child.draw(canvas);
    })
};

UIElement.prototype.onMouseMove = function(x,y) {
    var absPos = this.getAbsolutePosition();
    this.hover = x >= absPos.x - this.hoverMargin.left
        && x < absPos.x + this.size.width + this.hoverMargin.right
        && y >= absPos.y - this.hoverMargin.top
        && y < absPos.y + this.size.height + this.hoverMargin.bottom;
    this.childElements.forEach(function(child) {
        child.onMouseMove(x,y);
    })
};

UIElement.prototype.getAbsolutePosition = function() { // Position on screen
    var parentAbsolute = { x: 0, y: 0 };
    if(this.parentElement) {
        parentAbsolute = this.parentElement.getAbsolutePosition();
    }
    return { x: parentAbsolute.x + this.relX, y: parentAbsolute.y + this.relY };
};

UIElement.prototype.drawSelf = function() { }; // Virtual