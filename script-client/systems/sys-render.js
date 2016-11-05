'use strict';
var System = require('system');
var RenderManager = require('man-render');
var SpriteManager = require('man-sprite');
var ViewManager = require('man-view.js');
var UIManager = require('man-ui');
var requestAnimationFrame = require('raf');

var view = ViewManager.view;

var render = new System('render',[
    require('com-sprite3d')
]);
var zBuffer, currentFrame;
var backgroundColor = '#1d171f', bgImage, wox, woy;

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

// var renderTime = 0, frameCount = 0, previousFrame;

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
    view.canvas.drawSprite(SpriteManager, sprite, view.panX - wox, view.panY - woy);
}

render.onEntityAdded = function(entity) {
    var sprite = this.componentData[0][entity];
    sprite.zDepth = RenderManager.getZDepth(sprite.x, sprite.y);
    sprite.dx = RenderManager.getDrawX(sprite.x, sprite.y);
    sprite.dy = RenderManager.getDrawY(sprite.x, sprite.y, sprite.z);
    sprite.fdx = sprite.dx + sprite.dox;
    sprite.fdy = sprite.dy + sprite.doy;
    RenderManager.setZBuffer(render.componentData[0]); // Send sprite data to zBuffer
};

render.onEntityRemoved = function() {
    RenderManager.setZBuffer(render.componentData[0]); // Send sprite data to zBuffer
};

render.setWorld = function(world) {
    bgImage = world.image;
    wox = world.imageCenter.x;
    woy = world.imageCenter.y;
    ViewManager.setCenter(world.imageCenter.x, world.imageCenter.y + 8);
};

module.exports = render;