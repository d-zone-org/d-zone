'use strict';
var PIXI = require('pixi.js');
var Text = require('./../text');

module.exports = TextBox;

TextBox.prototype = Object.create(PIXI.Container.prototype);

function TextBox(text, options) {
    PIXI.Container.call(this);
    this.textOptions = options || {};
    var blottedText = Text.blotText(Object.assign({ text }, this.textOptions));
    var meta = blottedText.meta;
    var page;
    this.meta = { pages: [], page: 0, maxLines: this.textOptions.maxLines || 99 };
    this.meta.pageHeight = this.meta.maxLines * meta.lines[0].height - this.meta.maxLines * 2;
    var baseTexture = new PIXI.BaseTexture(blottedText.canvas);
    for(let i = 0; i < meta.lines.length; i++) {
        if(i % this.meta.maxLines === 0) {
            page = new PIXI.Container();
            page.meta = { lines: [] };
            this.meta.pages.push(page);
            this.addChild(page);
        }
        var lineSprite = new PIXI.Sprite(new PIXI.Texture(
            baseTexture, new PIXI.Rectangle(
                meta.lines[i].x, meta.lines[i].y,
                meta.lines[i].width, meta.lines[i].height
            )
        ));
        lineSprite.x = meta.lines[i].x;
        lineSprite.y = (meta.lines[i].y - i * 2) % this.meta.pageHeight;
        lineSprite.meta = meta.lines[i];
        lineSprite.meta.charsShown = 0;
        page.meta.lines.push(lineSprite);
        page.addChild(lineSprite);
    }
    this.visible = !this.textOptions.unrevealed;
}

TextBox.prototype.revealChar = function() {
    if(!this.visible) { // Reveal textbox and hide all pages
        this.visible = true;
        for(let p = 0; p < this.meta.pages.length; p++) {
            this.meta.pages[p].visible = false;
        }
    }
    if(this.meta.state === 'new-page') {
        this.meta.pages[this.meta.page].visible = false;
        this.meta.page++;
        this.meta.state = false;
    }
    var page = this.meta.pages[this.meta.page];
    if(!page.visible) { // Reveal page and hide all lines
        page.visible = true;
        for(let c = 0; c < page.children.length; c++) {
            page.children[c].visible = false;
        }
    }
    for(let i = 0; i < page.meta.lines.length; i++) {
        if(page.meta.lines[i].meta.revealed) continue;
        this.revealLineChar(page.meta.lines[i]);
        if(page.meta.lines[i].meta.revealed && i === page.meta.lines.length - 1) {
            if(this.meta.page < this.meta.pages.length - 1) this.meta.state = 'new-page'; // Not last page
            else this.meta.state = 'finished'; // Last page reached
        }
        break;
    }
};

TextBox.prototype.revealLineChar = function(line) {
    if(!line.visible) line.visible = true;
    line.meta.charsShown++;
    if(line.meta.charsShown === line.meta.charsX.length) {
        line.mask.destroy();
        line.mask = null;
        return line.meta.revealed = true;
    }
    if(!line.mask) {
        line.mask = new PIXI.Graphics();
        line.mask.x = line.x;
        line.mask.y = line.y;
        this.meta.pages[this.meta.page].addChild(line.mask);
    }
    line.mask.clear()
        .drawRect(0, 0, line.meta.charsX[line.meta.charsShown], line.height);
};