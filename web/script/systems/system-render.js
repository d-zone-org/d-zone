'use strict';
var System = require('./system');
var RenderManager = require('./../managers/manager-render');
var requestAnimationFrame = require('raf');

var render = new System('render',['sprite']);
var zBuffer, currentFrame, previousFrame, canvas, ctx;
var width, height, backgroundColor;

render.update = function() { // Overrides update method to wait for browser animation frame
    zBuffer = RenderManager.getZBuffer();
    requestAnimationFrame.cancel(currentFrame); // Cancel previous frame request
    currentFrame = requestAnimationFrame(onFrameReady);
};

function onFrameReady() {
    //var framesSkipped = currentFrame - previousFrame - 1;
    //if(framesSkipped) console.log('Skipped',framesSkipped,'frames');
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0,0,width,height);
    for(var s = 0; s < zBuffer.length; s++) {
        renderSprite(zBuffer[s]);
    }
    //previousFrame = currentFrame;
}

function renderSprite(sprite) {
    ctx.fillStyle = sprite.color;
    ctx.fillRect(sprite.x,sprite.y,sprite.w,sprite.h);
}

render.onEntityAdded = function(componentData) {
    var sprite = componentData[0].slice(-1)[0];
    sprite.zDepth = sprite.y;
    RenderManager.setZBuffer(render.componentData[0].slice(0));
};

render.onEntityRemoved = function() {
    RenderManager.setZBuffer(render.componentData[0].slice(0));
};

render.setCanvas = function(c) {
    canvas = c.canvas;
    ctx = c.context;
    this.updateCanvasSize(c.width, c.height);
};

render.updateCanvasSize = function(w,h) {
    width = w;
    height = h;
};

render.configure = function(options) {
    backgroundColor = options.backgroundColor;
};

module.exports = render;