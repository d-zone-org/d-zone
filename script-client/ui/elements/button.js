'use strict';
var inherits = require('inherits');
var Element = require('./../element');

module.exports = Button;
inherits(Button,Element);

function Button(x, y, width, height, text) {
    Element.call(this, { x, y, width, height, hoverState: true });
    this.text = text;
}

Button.prototype.drawSelf = function() {
    this.elementCanvas.clear();
    this.elementCanvas.context.globalAlpha = this.hover ? 0.9 : 0.75;
    this.elementCanvas.context.fillStyle = this.hover ? '#FFFFFF' : '#F5F0D5';
    this.elementCanvas.context.fillRect(0, 0, this.width, this.height);
    this.elementCanvas.context.fillStyle = '#000000';
    this.elementCanvas.context.fillRect(1, 1, this.width - 2, this.height - 2);
    this.elementCanvas.context.fillStyle = '#FFFFFF';
    this.elementCanvas.context.textAlign = 'center';
    this.elementCanvas.context.fillText(this.text, Math.floor(this.width / 2), Math.floor(this.height / 2) + 3, this.width);
    this.elementCanvas.context.globalAlpha = 1;
};