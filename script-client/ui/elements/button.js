'use strict';
var inherits = require('inherits');
var Element = require('./../element');
var Styles = require('./../styles').button;

module.exports = Button;
inherits(Button,Element);

function Button(x, y, width, height, text, onClick) {
    Element.call(this, { x, y, width, height, hoverable: true, clickable: true });
    this.text = text;
    this.onClick = onClick;
}

Button.prototype.drawSelf = function() {
    this.elementCanvas.clear();
    var style = this.clicking ? Styles.click : this.hover ? Styles.hover : Styles.normal;
    this.elementCanvas.context.globalAlpha = style.alpha;
    this.elementCanvas.context.fillStyle = style.border;
    this.elementCanvas.context.fillRect(0, 0, this.width, this.height);
    this.elementCanvas.context.fillStyle = style.fill;
    this.elementCanvas.context.fillRect(1, 1, this.width - 2, this.height - 2);
    this.elementCanvas.context.fillStyle = style.text;
    this.elementCanvas.context.textAlign = 'center';
    this.elementCanvas.context.fillText(this.text, Math.floor(this.width / 2), Math.floor(this.height / 2) + 3, this.width);
    this.elementCanvas.context.globalAlpha = 1;
};

Button.prototype.click = function() {
    this.onClick();
    this.makeDirty();
};