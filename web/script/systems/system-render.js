'use strict';
var System = require('./system');
var CanvasManager = require('./../managers/manager-canvas');
var RenderManager = require('./../managers/manager-render');
var SpriteManager = require('./../managers/manager-sprite');
var requestAnimationFrame = require('raf');

var render = new System('render',['sprite']);
var zBuffer, currentFrame, previousFrame;
var canvas;
var backgroundColor, bgImage;

CanvasManager.events.on('canvas-update', function(c) {
    canvas = c;
});

render.update = function() { // Overrides update method to wait for browser animation frame
    zBuffer = RenderManager.getZBuffer();
    if(!SpriteManager.loaded) return;
    requestAnimationFrame.cancel(currentFrame); // Cancel previous frame request
    currentFrame = requestAnimationFrame(onFrameReady);
};

// var fiveSecRenderTime = 0;
// var frameCount = 0;

function onFrameReady() {
    //var framesSkipped = currentFrame - previousFrame - 1;
    //if(framesSkipped) console.log('Skipped',framesSkipped,'frames');
    // frameCount++;
    var renderStart = performance.now();
    canvas.fill(backgroundColor);
    if(bgImage) canvas.drawImage(bgImage,0,0,bgImage.width,bgImage.height,
        CanvasManager.panX,CanvasManager.panY); // Make separate bg canvas?
    for(var s = 0; s < zBuffer.length; s++) {
        renderSprite(zBuffer[s]);
    }
    // fiveSecRenderTime += performance.now() - renderStart;
    // if(frameCount == 3000) { frameCount = 0; console.log(fiveSecRenderTime/3000); fiveSecRenderTime = 0; }
    //previousFrame = currentFrame;
}

function renderSprite(sprite) {
    canvas.fillRect(sprite.color,sprite.x,sprite.y,sprite.w,sprite.h);
}

render.onEntityAdded = function(componentData) {
    var sprite = componentData[0].slice(-1)[0];
    sprite.zDepth = sprite.y;
    RenderManager.setZBuffer(render.componentData[0].slice(0));
};

render.onEntityRemoved = function() {
    RenderManager.setZBuffer(render.componentData[0].slice(0));
};

render.configure = function(options) {
    backgroundColor = options.backgroundColor;
};

render.setWorld = function(world) {
    bgImage = world.image;
    CanvasManager.panX = Math.round(canvas.width / 2 - world.imageCenter.x);
    CanvasManager.panY = Math.round(canvas.height / 2 - world.imageCenter.y - 8);
};

module.exports = render;