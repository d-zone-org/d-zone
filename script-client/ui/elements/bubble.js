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
    this.setText(text);
    this.draw();
}

Bubble.prototype.draw = function() {
    this.graphics.alpha = style.fillAlpha;
    this.graphics.clear()
        .lineStyle(1, style.border).beginFill(style.fill)
        .drawPolygon([
            new PIXI.Point(0, 0),
            new PIXI.Point(this.bubbleWidth, 0),
            new PIXI.Point(this.bubbleWidth, this.bubbleHeight),
            new PIXI.Point(Math.floor(this.bubbleWidth/2) + 6, this.bubbleHeight),
            new PIXI.Point(Math.floor(this.bubbleWidth/2), this.bubbleHeight + 6),
            new PIXI.Point(Math.floor(this.bubbleWidth/2) - 6, this.bubbleHeight),
            new PIXI.Point(0, this.bubbleHeight)
        ]).closePath();
};

Bubble.prototype.revealChar = function() {
    this.textSprite.revealChar();
    this.state = this.textSprite.meta.state;
};

Bubble.prototype.setText = function(text) {
    if(this.textSprite) this.textSprite.destroy(true);
    this.textSprite = this.addChild(new TextBox(text, {
        maxWidth: 150, maxLines: 4, align: 'left', unrevealed: true 
    }));
    this.bubbleWidth = this.textSprite.width + 8;
    this.bubbleHeight = this.textSprite.height + 3;
    this.textSprite.alpha = style.textAlpha;
    this.textSprite.x = Math.floor(this.bubbleWidth / 2 - this.textSprite.width / 2);
    this.textSprite.y = 2;
    this.totalChars = this.textSprite.meta.totalChars;
    this.charsShown = this.textSprite.meta.charsShown;
};

Bubble.prototype.updatePosition = function() {
    var scaleRatio = this.gameView.scale / this.ui.scale;
    this.x = Math.floor(scaleRatio * (this.gx - this.gameView.panX + this.gameView.originX) 
        - this.bubbleWidth / 2);
    this.y = Math.floor(scaleRatio * (this.gy - this.gameView.panY + this.gameView.originY - 11) 
        - this.bubbleHeight);
    this.x = Math.max(1, Math.min(this.ui.width - this.bubbleWidth - 2, this.x));
    this.y = Math.max(1, Math.min(this.ui.height - this.bubbleHeight - 2, this.y));
};

// TODO: Prevent elements overlapping with siblings