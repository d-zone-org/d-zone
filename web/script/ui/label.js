'use strict';
var inherits = require('inherits');
var UIElement = require('./uielement.js');
var TextBlotter = require('./../common/textblotter.js');

module.exports = Label;
inherits(Label, UIElement);

function Label(options) {
    UIElement.call(this, options);
    if(options.onPress) this.onPress = options.onPress;
    if(options.hyperlink) this.hyperlink = options.hyperlink;
    if(options.maxWidth) this.maxWidth = options.maxWidth;
    if(options.text) this.changeText(options.text);
    this.onMouseOnBound = this.onMouseOn.bind(this);
    this.on('mouse-on', this.onMouseOnBound);
    this.onMouseOffBound = this.onMouseOff.bind(this);
    this.on('mouse-off', this.onMouseOffBound);
    this.onMouseDownBound = this.onMouseDown.bind(this);
    this.on('mouse-down', this.onMouseDownBound);
    this.onMouseUpBound = this.onMouseUp.bind(this);
    this.on('mouse-up', this.onMouseUpBound);
}

Label.prototype.changeText = function(text) {
    this.text = text;
    this.textCanvas = TextBlotter.blot({ text: this.text, maxWidth: this.maxWidth });
    if(this.autosize) {
        this.w = this.canvas.canvas.width = this.textCanvas.width;
        this.h = this.canvas.canvas.height = this.textCanvas.height;
    }
    this.reposition();
    this.draw();
};

Label.prototype.draw = function() {
    this.canvas.clear();
    this.canvas.drawImage(this.textCanvas,0,0,this.textCanvas.width,this.textCanvas.height,
        0,0,this.textCanvas.width,this.textCanvas.height);
    this.emit('redraw');
};

Label.prototype.onMouseOn = function(mouseEvent) {
    if(this.mouseOn) return;
    this.mouseOn = true;
    if(this.hyperlink) document.body.style.cursor = 'pointer';
    this.emit('mouse-on-element', this);
    this.draw();
};

Label.prototype.onMouseOff = function(mouseEvent) {
    if(!this.mouseOn) return;
    this.mouseOn = false;
    if(this.hyperlink) document.body.style.cursor = 'default';
    this.pressed = false;
    this.emit('mouse-off-element', this);
    this.draw();
};

Label.prototype.onMouseDown = function(mouseEvent) {
    if(!this.mouseOn) return;
    this.pressed = true;
    this.draw();
};

Label.prototype.onMouseUp = function(mouseEvent) {
    if(!this.mouseOn) return;
    this.pressed = false;
    if(this.onPress) this.onPress();
    if(this.hyperlink) window.open(this.hyperlink);
    this.draw();
};