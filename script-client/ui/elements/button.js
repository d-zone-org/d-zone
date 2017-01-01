'use strict';
var inherits = require('inherits');
var Element = require('./../element');

module.exports = Button;
inherits(Button,Element);

function Button(x, y, width, height, text, onClick) {
    Element.call(this, { x, y, width, height, hoverable: true, clickable: true });
    this.text = text;
    this.onClick = onClick;
}

Button.prototype.drawSelf = function() {
    this.elementCanvas.clear();
    // TODO: Make a better way to configure color styling
    this.elementCanvas.context.globalAlpha = this.clicking ? 1.0 : this.hover ? 0.9 : 0.75;
    this.elementCanvas.context.fillStyle = this.clicking ? '#BAB0A8' : this.hover ? '#FFFFFF' : '#F5F0D5';
    this.elementCanvas.context.fillRect(0, 0, this.width, this.height);
    this.elementCanvas.context.fillStyle = '#000000';
    this.elementCanvas.context.fillRect(1, 1, this.width - 2, this.height - 2);
    this.elementCanvas.context.fillStyle = this.clicking ? '#BAB0A8' : '#FFFFFF';
    this.elementCanvas.context.textAlign = 'center';
    this.elementCanvas.context.fillText(this.text, Math.floor(this.width / 2), Math.floor(this.height / 2) + 3, this.width);
    this.elementCanvas.context.globalAlpha = 1;
};

Button.prototype.startClick = function() {
    this.makeDirty();
};

Button.prototype.click = function() {
    this.onClick();
    this.makeDirty();
};