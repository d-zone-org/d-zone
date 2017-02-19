'use strict';
var PIXI = require('pixi.js');
var style = require('./../styles').bubble;
var Text = require('./../text');

module.exports = Bubble;

Bubble.prototype = Object.create(PIXI.Container.prototype);

function Bubble(gx, gy, text, gameView, ui) {
    PIXI.Container.call(this);
    var blotMetrics = Text.getBlotMetrics(text, 160);
    this.bubbleWidth = blotMetrics.blottedWidth + 8;
    this.bubbleHeight = blotMetrics.blottedHeight + 6;
    this.gx = gx;
    this.gy = gy;
    this.gameView = gameView;
    this.ui = ui;
    this.text = text;
    this.graphics = this.addChild(new PIXI.Graphics());
    blotMetrics.align = 'left';
    this.textSprite = this.addChild(new PIXI.Sprite(PIXI.Texture.fromCanvas(Text.blotText(blotMetrics))));
    this.textSprite.alpha = style.textAlpha;
    this.textSprite.x = Math.floor(this.bubbleWidth / 2 - this.textSprite.width / 2);
    this.textSprite.y = Math.floor(this.bubbleHeight / 2 - this.textSprite.height / 2 + 1);
    this.textSprite.mask = new PIXI.Graphics();
    this.addChild(this.textSprite.mask);
    this.draw();
}

Bubble.prototype.draw = function() {
    this.graphics.clear();
    this.graphics.alpha = style.fillAlpha;
    this.graphics.beginFill(style.fill);
    this.graphics.drawRect(0, 0, this.bubbleWidth, this.bubbleHeight);
};

Bubble.prototype.setPercent = function(percent) {
    if(percent > 1) return;
    this.textSprite.mask.clear();
    this.textSprite.mask.drawRect(0, 0, this.bubbleWidth * percent, this.bubbleHeight);
};

Bubble.prototype.updatePosition = function() {
    var scaleRatio = this.gameView.scale / this.ui.scale;
    this.x = Math.floor(scaleRatio * (this.gx - this.gameView.panX + this.gameView.originX) 
        - this.bubbleWidth / 2);
    this.y = Math.floor(scaleRatio * (this.gy - this.gameView.panY + this.gameView.originY - 6)) - 16;
    this.x = Math.max(1, Math.min(this.ui.width - this.bubbleWidth - 2, this.x));
    this.y = Math.max(1, Math.min(this.ui.height - this.bubbleHeight - 2, this.y));
};

// TODO: Prevent elements overlapping with siblings