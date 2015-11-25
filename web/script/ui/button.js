'use strict';
var inherits = require('inherits');
var UIElement = require('./uielement.js');
var TextBlotter = require('./../common/textblotter.js');

module.exports = Button;
inherits(Button, UIElement);

function Button(options) {
    UIElement.call(this, options);
    if(options.text) this.changeText(options.text);
    if(options.onPress) this.onPress = options.onPress;
    this.onMouseOnBound = this.onMouseOn.bind(this);
    this.on('mouse-on', this.onMouseOnBound);
    this.onMouseOffBound = this.onMouseOff.bind(this);
    this.on('mouse-off', this.onMouseOffBound);
    this.onMouseDownBound = this.onMouseDown.bind(this);
    this.on('mouse-down', this.onMouseDownBound);
    this.onMouseUpBound = this.onMouseUp.bind(this);
    this.on('mouse-up', this.onMouseUpBound);
}

Button.prototype.changeText = function(text) {
    this.text = text;
    this.textCanvas = TextBlotter.blot({ text: this.text });
    if(this.autosize) {
        this.w = this.canvas.canvas.width = this.textCanvas.width + 2;
        this.h = this.canvas.canvas.height = this.textCanvas.height + 2;
    }
    this.draw();
};

Button.prototype.draw = function() {
    this.canvas.clear();
    this.canvas.fillRect('rgba(255,255,255,0.8)',0,0,this.w,this.h);
    this.canvas.clearRect(1,1,this.w-2,this.h-2);
    var buttonColor = this.mouseOn ? 'rgba(77,102,184,0.9)' : 'rgba(0,0,0,0.8)';
    this.canvas.fillRect(buttonColor,1,1,this.w-2,this.h-2);
    var textOffset = Math.floor((this.canvas.canvas.width - this.textCanvas.width) / 2);
    this.canvas.drawImage(this.textCanvas,0,0,this.textCanvas.width,this.textCanvas.height,
        textOffset,1,this.textCanvas.width,this.textCanvas.height);
    this.emit('redraw');
};

Button.prototype.onMouseOn = function(mouseEvent) {
    if(this.mouseOn) return;
    this.mouseOn = true;
    this.emit('mouse-on-element', this);
    this.draw();
};

Button.prototype.onMouseOff = function(mouseEvent) {
    if(!this.mouseOn) return;
    this.mouseOn = false;
    this.pressed = false;
    this.emit('mouse-off-element', this);
    this.draw();
};

Button.prototype.onMouseDown = function(mouseEvent) {
    if(!this.mouseOn) return;
    this.pressed = true;
    this.draw();
};

Button.prototype.onMouseUp = function(mouseEvent) {
    if(!this.mouseOn) return;
    this.pressed = false;
    if(this.onPress) this.onPress();
    this.draw();
};