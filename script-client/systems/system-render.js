'use strict';
var System = require('system');
var RenderManager = require('manager-render');
var SpriteManager = require('manager-sprite');
var ViewManager = require('manager-view.js');
var UIManager = require('manager-ui');
var requestAnimationFrame = require('raf');

var view = ViewManager.view;

var render = new System('render',[
    require('component-sprite')
]);
var zBuffer, currentFrame, previousFrame;
var backgroundColor = '#1d171f', bgImage;

render.update = function() { // Overrides update method to wait for browser animation frame
    zBuffer = RenderManager.getZBuffer();
    // Insert loading screen here
};

SpriteManager.waitForLoaded(function() { // Wait for sprites to load
    render.update = update; // Change update method
});

function update() { // Real update method once sprites are loaded
    zBuffer = RenderManager.getZBuffer();
    requestAnimationFrame.cancel(currentFrame); // Cancel current frame request
    currentFrame = requestAnimationFrame(onFrameReady); // Request new frame
}

// var renderTime = 0;
// var frameCount = 0;

function onFrameReady() {
    //var framesSkipped = currentFrame - previousFrame - 1;
    //if(framesSkipped) console.log('Skipped',framesSkipped,'frames');
    // frameCount++;
    // var renderStart = performance.now();
    if(ViewManager.onFrameReady) ViewManager.onFrameReady(); // If view manager is waiting on a new frame
    view.canvas.fill(backgroundColor);
    // Make separate bg canvas?
    if(bgImage) view.canvas.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height, -view.panX, -view.panY); 
    for(var s = 0; s < zBuffer.length; s++) {
        renderSprite(zBuffer[s]);
    }
    UIManager.draw(view.canvas); // Draw UI
    // renderTime += performance.now() - renderStart;
    // if(frameCount == 500) { frameCount = 0; console.log(renderTime/500); renderTime = 0; }
    //previousFrame = currentFrame;
}

function renderSprite(sprite) {
    view.canvas.fillRect(sprite.color,sprite.x,sprite.y,sprite.w,sprite.h);
}

render.onEntityAdded = function(entity) {
    var sprite = this.componentData[0][entity];
    sprite.zDepth = sprite.x + sprite.y;
    RenderManager.setZBuffer(render.componentData[0].slice(0));
};

render.onEntityRemoved = function() {
    RenderManager.setZBuffer(render.componentData[0].slice(0));
};

render.setWorld = function(world) {
    bgImage = world.image;
    ViewManager.setCenter(world.imageCenter.x, world.imageCenter.y + 8);
};

module.exports = render;