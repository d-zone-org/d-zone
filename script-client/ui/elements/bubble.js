'use strict';
var Styles = require('./../styles').bubble;
var Text = require('./../text');

module.exports = Bubble;

function Bubble(gx, gy, text, gameView, ui) {
    var blotMetrics = Text.getBlotMetrics(text, 160);
    var width = blotMetrics.blottedWidth + 8;
    Element.call(this, { width, height: blotMetrics.blottedHeight + 6 });
    this.gx = gx;
    this.gy = gy;
    this.moveToGameXY(gameView, ui);
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

Bubble.prototype.moveToGameXY = function(gameView, ui) {
    var scaleRatio = gameView.scale / ui.scale;
    this.x = Math.floor(scaleRatio * (this.gx - gameView.panX + gameView.originX) - this.width / 2 + 1 );
    this.y = Math.floor(scaleRatio * (this.gy - gameView.panY + gameView.originY - 15)) - 16;
    this.x = Math.max(1, Math.min(ui.width - this.width - 2, this.x));
    this.y = Math.max(1, Math.min(ui.height - this.height - 2, this.y));
};

// TODO: Prevent elements overlapping with siblings

Bubble.prototype.gameViewChange = function(gameView, ui) {
    this.moveToGameXY(gameView, ui);
    this.makeDirty();
};