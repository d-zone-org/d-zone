'use strict';
var PIXI = require('pixi.js');
var style = require('./../styles').bubble;
var TextBox = require('./textbox');

module.exports = Bubble;

Bubble.prototype = Object.create(PIXI.Container.prototype);

function Bubble(gx, gy, text, gameView, ui) {
    PIXI.Container.call(this);
    this.gx = gx;
    this.gy = gy;
    this.gameView = gameView;
    this.ui = ui;
    this.graphics = this.addChild(new PIXI.Graphics());
    this.textSprite = this.addChild(new TextBox(text, { maxWidth: 160, align: 'left', revealed: 0 }));
    this.bubbleWidth = this.textSprite.width + 8;
    this.bubbleHeight = this.textSprite.height + 3;
    this.textSprite.alpha = style.textAlpha;
    this.textSprite.x = Math.floor(this.bubbleWidth / 2 - this.textSprite.width / 2);
    this.textSprite.y = 2;
    this.draw();
}

Bubble.prototype.draw = function() {
    this.graphics.clear();
    this.graphics.alpha = style.fillAlpha;
    this.graphics.beginFill(style.fill);
    this.graphics.drawRect(0, 0, this.bubbleWidth, this.bubbleHeight);
};

Bubble.prototype.setProgress = function(percent) {
    this.textSprite.setRevealed(percent);
};

Bubble.prototype.addMessage = function(text) {
    this.textSprite.addText(text);
};

Bubble.prototype.updatePosition = function() {
    var scaleRatio = this.gameView.scale / this.ui.scale;
    this.x = Math.floor(scaleRatio * (this.gx - this.gameView.panX + this.gameView.originX) 
        - this.bubbleWidth / 2);
    this.y = Math.floor(scaleRatio * (this.gy - this.gameView.panY + this.gameView.originY - 6) 
        - this.bubbleHeight);
    this.x = Math.max(1, Math.min(this.ui.width - this.bubbleWidth - 2, this.x));
    this.y = Math.max(1, Math.min(this.ui.height - this.bubbleHeight - 2, this.y));
};

// TODO: Prevent elements overlapping with siblings