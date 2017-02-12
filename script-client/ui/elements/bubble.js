'use strict';
var inherits = require('inherits');
var Element = require('./../element');
var Styles = require('./../styles').bubble;
var Text = require('./../text');

module.exports = Bubble;
inherits(Bubble, Element);

function Bubble(x, y, text) {
    var blotMetrics = Text.getBlotMetrics(text, 160);
    var width = blotMetrics.blottedWidth + 8;
    Element.call(this, { x: x - Math.floor(width / 2), y, width, height: blotMetrics.blottedHeight + 6 });
    this.text = text;
}

Bubble.prototype.drawSelf = function() {
    this.elementCanvas.clear();
    this.elementCanvas.context.globalAlpha = Styles.fillAlpha;
    this.elementCanvas.context.fillStyle = Styles.fill;
    this.elementCanvas.context.fillRect(0, 0, this.width, this.height);
    this.elementCanvas.context.globalAlpha = Styles.textAlpha;
    Text.blotText({ text: this.text, maxWidth: this.width, x: 4, y: Math.floor(this.height / 2) - 4, canvas: this.elementCanvas, align: 'left' });
    this.elementCanvas.context.globalAlpha = 1;
};