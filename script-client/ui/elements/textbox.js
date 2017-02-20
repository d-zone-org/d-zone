'use strict';
var PIXI = require('pixi.js');
var Text = require('./../text');

module.exports = TextBox;

TextBox.prototype = Object.create(PIXI.Container.prototype);

function TextBox(text, options) {
    PIXI.Container.call(this);
    this.textOptions = options;
    this.addText(text);
    if(options.revealed !== undefined) this.setRevealed(options.revealed);
}

TextBox.prototype.addText = function(text) {
    var blottedText = Text.blotText(Object.assign({ text }, this.textOptions));
    var meta = blottedText.meta;
    var baseTexture = new PIXI.BaseTexture(blottedText.canvas);
    for(let i = 0; i < meta.lines.length; i++) {
        var lineSprite = new PIXI.Sprite(
            new PIXI.Texture(
                baseTexture,
                new PIXI.Rectangle(
                    meta.lines[i].x, meta.lines[i].y,
                    meta.lines[i].width, meta.lines[i].height
                )
            )
        );
        lineSprite.x = meta.lines[i].x;
        lineSprite.y = meta.lines[i].y - i * 2;
        lineSprite.meta = meta.lines[i];
        meta.lines[i] = lineSprite;
        this.addChild(lineSprite);
    }
    if(this.meta) {
        this.meta.width = Math.max(this.meta.width, meta.width);
        this.meta.totalChars += 1 + meta.totalChars;
        for(let i = 0; i < meta.lines.length; i++) {
            meta.lines[i].meta.y += this.meta.height;
            meta.lines[i].y += this.meta.height;
        }
        this.meta.height += meta.height;
        this.meta.lines.push(...meta.lines);
    } else this.meta = meta;
    //console.log(this.meta.height,this.meta.lines.length);
};

TextBox.prototype.setRevealed = function(percent) {
    percent = Math.min(1, Math.max(0, percent));
    if(percent === 0) return this.visible = false;
    var showChars = Math.round(this.meta.totalChars * percent);
    if(this.meta.charsShown === showChars) return;
    this.meta.charsShown = showChars;
    this.visible = true;
    this.meta.charsShown = Math.round(this.meta.totalChars * percent);
    for(var i = 0; i < this.meta.lines.length; i++) {
        this.revealLine(this.meta.lines[i], showChars);
        showChars -= this.meta.lines[i].meta.charsX.length;
    }
};

TextBox.prototype.revealLine = function(line, chars) {
    chars = Math.min(line.meta.charsX.length, Math.max(0, chars));
    line.visible = true;
    if(chars === line.meta.charsX.length) {
        if(line.mask) line.mask.destroy();
        return line.mask = null;
    }
    if(chars === 0) return line.visible = false;
    if(!line.mask) {
        line.mask = new PIXI.Graphics();
        line.mask.x = line.x;
        line.mask.y = line.y;
        this.addChild(line.mask);
    }
    line.mask.clear();
    line.mask.drawRect(0, 0, line.meta.charsX[chars], line.height);
};