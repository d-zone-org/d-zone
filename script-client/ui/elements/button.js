'use strict';
var inherits = require('inherits');
var Element = require('./../element');
var Styles = require('./../styles').button;
var Text = require('./../text');

module.exports = Button;
inherits(Button, Element);

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
    Text.blotText({ text: this.text, maxWidth: this.width, y: Math.floor(this.height / 2) - 4, canvas: this.elementCanvas, align: 'center' });
    this.elementCanvas.context.globalAlpha = 1;
};

Button.prototype.click = function() {
    this.onClick();
    this.makeDirty();
};