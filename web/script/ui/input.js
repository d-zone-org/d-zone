'use strict';
var inherits = require('inherits');
var UIElement = require('./uielement.js');
var TextBlotter = require('./../common/textblotter.js');
var util = require('./../common/util.js');

module.exports = Input;
inherits(Input, UIElement);

function Input(options) {
    UIElement.call(this, options);
    this.changeText(options.text || '');
    if(options.onSubmit) this.onSubmit = options.onSubmit;
    this.onMouseOnBound = this.onMouseOn.bind(this);
    this.on('mouse-on', this.onMouseOnBound);
    this.onMouseOffBound = this.onMouseOff.bind(this);
    this.on('mouse-off', this.onMouseOffBound);
    this.onMouseDownBound = this.onMouseDown.bind(this);
    this.on('mouse-down', this.onMouseDownBound);
    this.onMouseUpBound = this.onMouseUp.bind(this);
    this.on('mouse-up', this.onMouseUpBound);
    this.onKeyDownBound = this.onKeyDown.bind(this);
    this.on('key-down', this.onKeyDownBound);
}

Input.prototype.changeText = function(text) {
    this.text = text;
    var showText = text + (this.focused ? '_' : '');
    this.textCanvas = TextBlotter.blot({ text: showText });
    if(this.autosize) {
        this.w = this.canvas.canvas.width = this.textCanvas.width + 2;
        this.h = this.canvas.canvas.height = this.textCanvas.height + 2;
    }
    this.draw();
};

Input.prototype.draw = function() {
    this.canvas.clear();
    var borderColor = this.mouseOn ? 'rgba(220,220,220,0.8)' : 'rgba(255,255,255,0.8)';
    borderColor = this.focused ? 'rgba(115,138,215,0.8)' : borderColor;
    this.canvas.fillRect(borderColor,0,0,this.w,this.h);
    this.canvas.clearRect(1,1,this.w-2,this.h-2);
    this.canvas.fillRect('rgba(0,0,0,0.8)',1,1,this.w-2,this.h-2);
    this.canvas.drawImage(this.textCanvas,0,0,this.textCanvas.width,this.textCanvas.height,
        1,1,this.textCanvas.width,this.textCanvas.height);
    this.emit('redraw');
};

Input.prototype.focus = function(setTo) {
    this.focused = setTo !== false;
    this.changeText(this.text);
};

Input.prototype.submit = function() {
    this.onSubmit(this.text);
};

Input.prototype.onMouseOn = function(mouseEvent) {
    if(this.mouseOn) return;
    this.mouseOn = true;
    this.emit('mouse-on-element', this);
    this.draw();
};

Input.prototype.onMouseOff = function(mouseEvent) {
    if(!this.mouseOn) return;
    this.mouseOn = false;
    this.emit('mouse-off-element', this);
    this.draw();
};

Input.prototype.onMouseDown = function(mouseEvent) {
    if(!this.mouseOn) this.focus(false);
};

Input.prototype.onMouseUp = function(mouseEvent) {
    if(this.mouseOn) this.focus();
};

Input.prototype.onKeyDown = function(keyEvent) {
    if(!this.focused) return;
    if(keyEvent.key == 'enter') this.submit();
    // TODO: Move this stuff into a typing event in engine/input.js
    var typed = keyEvent.key;
    if(keyEvent.key == 'backspace') {
        this.changeText(this.text.substring(0,Math.max(0,this.text.length-1)));
    } else {
        if(keyEvent.key == 'period') typed = '.';
        if(keyEvent.key == 'dash') typed = '-';
        if(typed != '.' && typed != '-' 
            && util.alphabet.indexOf(typed) < 0 && util.hex.indexOf(typed) < 0) return;
        this.changeText(this.text + (this.ui.game.input.keys.shift ? typed.toUpperCase() : typed));
    }
};