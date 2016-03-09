'use strict';
var System = require('./system');
var requestAnimationFrame = require('raf');

var render = new System('render',['sprite']);
var currentFrame, previousFrame, canvas, ctx;
var backgroundColor;

render.update = function() { // Overrides update method to wait for browser animation frame
    requestAnimationFrame.cancel(currentFrame); // Cancel previous frame request
    currentFrame = requestAnimationFrame(onFrameReady);
};

function onFrameReady() {
    //var framesSkipped = currentFrame - previousFrame - 1;
    //if(framesSkipped) console.log('Skipped',framesSkipped,'frames');
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    System.prototype.update.call(render);
    //previousFrame = currentFrame;
}

render.updateEntity = function(entity) {
    var sprite = this.componentData[0][entity];
    ctx.fillStyle = sprite.color;
    ctx.fillRect(sprite.x,sprite.y,sprite.w,sprite.h);
};

render.setCanvas = function(c) {
    canvas = c.canvas;
    ctx = c.context;
};

render.configure = function(options) {
    backgroundColor = options.backgroundColor;
};

module.exports = render;