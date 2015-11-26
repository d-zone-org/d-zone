'use strict';
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var BetterCanvas = require('./../common/bettercanvas.js');
var util = require('./../common/util.js');

module.exports = UIElement;
inherits(UIElement, EventEmitter);

function UIElement(options) {
    this.ui = options.ui;
    this.parent = options.parent;
    this.elements = [];
    this.w = 1; this.h = 1;
    if(options.hasOwnProperty('w')) this.w = options.w; else this.autosize = true;
    if(options.hasOwnProperty('h')) this.h = options.h; else this.autosize = true;
    if(options.hasOwnProperty('top')) this.top = options.top;
    if(options.hasOwnProperty('bottom')) this.bottom = options.bottom;
    if(options.hasOwnProperty('left')) this.left = options.left;
    if(options.hasOwnProperty('right')) this.right = options.right;
    this.canvas = new BetterCanvas(this.w || 1, this.h || 1);
    this.reposition();
}

UIElement.prototype.reposition = function() {
    if(this.hasOwnProperty('top')) {
        if(this.top == 'auto') {
            this.y = Math.round(this.parent.y + this.parent.h/2 - this.h/2);
        } else {
            this.y = this.parent.y + this.top;
        }
    }
    if(this.hasOwnProperty('bottom')) this.y = this.parent.y + this.parent.h - this.h - this.bottom;
    if(this.hasOwnProperty('left')) {
        if(this.left == 'auto') {
            this.x = Math.round(this.parent.x + this.parent.w/2 - this.w/2);
        } else {
            this.x = this.parent.x + this.left;
        }
    }
    if(this.hasOwnProperty('right')) this.x = this.parent.x + this.parent.w - this.w - this.right;
};

UIElement.prototype.redraw = function(canvas) {
    canvas.drawImage(this.canvas.canvas || this.canvas, 0, 0, this.w, this.h, this.x, this.y, this.w, this.h);
};

UIElement.prototype.remove = function() {
    if(this.ui.mouseOnElement === this) this.ui.mouseOnElement = false;
    this.removeAllListeners('redraw');
    this.removeAllListeners('mouse-on-element');
    this.removeAllListeners('mouse-off-element');
    util.findAndRemove(this, this.ui.elements);
    if(this.elements) {
        for(var i = 0; i < this.elements.length; i++) {
            this.elements[i].remove();
        }
    }
    this.ui.redraw();
};