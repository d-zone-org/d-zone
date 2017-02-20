'use strict';
var PIXI = require('pixi.js');
var Styles = require('./../styles').button;
var TextBox = require('./textbox');

module.exports = Button;

Button.prototype = Object.create(PIXI.Container.prototype);

function Button(x, y, width, height, text, onClick) {
    PIXI.Container.call(this);
    this.x = x;
    this.y = y;
    this.buttonWidth = width;
    this.buttonHeight = height;
    this.graphics = this.addChild(new PIXI.Graphics());
    this.textSprite = this.addChild(new TextBox(text, { maxWidth: this.buttonWidth - 2 }));
    this.textSprite.x = Math.floor(this.buttonWidth / 2 - this.textSprite.width / 2);
    this.textSprite.y = Math.floor(this.buttonHeight / 2 - this.textSprite.height / 2 + 1);
    this.interactive = true;
    this.onClick = onClick;
    this.on('click', this.onClick);
    this.on('mouseover', this.onHover);
    this.on('mouseout', this.offHover);
    this.on('mousedown', this.onMouseDown);
    this.on('mouseup', this.onMouseUp);
    this.on('mouseupoutside', this.onMouseUp);
    this.draw();
}

Button.prototype.draw = function() {
    // TODO: Add 1px inner shadow and drop shadow
    this.graphics.clear();
    var style = this.clicking ? Styles.click : this.hover ? Styles.hover : Styles.normal;
    this.alpha = style.alpha;
    this.graphics.beginFill(style.fill);
    this.graphics.lineStyle(1, style.border);
    this.graphics.drawRect(0, 0, this.buttonWidth - 1, this.buttonHeight - 1);
};

Button.prototype.onHover = function(e) {
    this.hover = true;
    this.draw();
};

Button.prototype.offHover = function(e) {
    this.hover = false;
    this.draw();
};

Button.prototype.onMouseDown = function(e) {
    console.log('button mouse down');
    this.lastEvent = e.data.originalEvent;
    this.clicking = true;
    this.draw();
};

Button.prototype.onMouseUp = function(e) {
    this.clicking = false;
    this.draw();
};

Button.prototype.isEventCaptured = function(e) {
    return e.e === this.lastEvent;
};