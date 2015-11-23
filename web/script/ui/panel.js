'use strict';
var inherits = require('inherits');
var UIElement = require('./uielement.js');

module.exports = Panel;
inherits(Panel, UIElement);

function Panel(options) {
    UIElement.call(this, options);
    this.draw();
}

Panel.prototype.draw = function() {
    this.canvas.clear();
    this.canvas.fillRect('rgba(255,255,255,0.8)',0,0,this.w,this.h);
    this.canvas.clearRect(1,1,this.w-2,this.h-2);
    this.canvas.fillRect('rgba(0,0,0,0.8)',1,1,this.w-2,this.h-2);
    this.emit('redraw');
};