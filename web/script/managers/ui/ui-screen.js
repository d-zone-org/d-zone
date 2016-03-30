'use strict';
var inherits = require('inherits');
var UIElement = require('./ui-element');

module.exports = Screen;
inherits(Screen,UIElement);

function Screen(size/*, background*/) {
    UIElement.call(this,{});
    this.size = size;
    if(arguments[1]) this.background = arguments[1];
}

Screen.prototype.draw = function(uiCanvas) {
    this.childElements.forEach(function(child) {
        child.draw(this.elementCanvas);
    }, this);
    uiCanvas.context.drawImage(this.elementCanvas.canvas,0,0);
};

Screen.prototype.drawSelf = function() {
    if(this.background) this.elementCanvas.fill(this.background);
};