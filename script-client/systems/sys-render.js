'use strict';
var System = require('system');
var RenderManager = require('man-render');
var SpriteManager = require('man-sprite');
var ViewManager = require('man-view.js');
var requestAnimationFrame = require('raf');

var view = ViewManager.view;

var render = new System([
    require('com-sprite3d')
]);
var zBuffer, currentFrame;
var spriteSheets, backgroundColor = '#1d171f', bgImage, wox, woy;

render.onViewReady = function() {
    render.update = function() { // Overrides update method to wait for browser animation frame
        // Insert loading screen here
    };
    SpriteManager.waitForLoaded(function() { // Wait for sprite sheets to load
        spriteSheets = SpriteManager.sheets;
        render.update = update; // Change update method to start drawing game
    });
};

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
    // renderTime += performance.now() - renderStart;
    // if(frameCount == 500) { frameCount = 0; console.log(renderTime/500); renderTime = 0; }
    //previousFrame = currentFrame;
}

function renderSprite(sprite) {
    view.canvas.drawSprite(spriteSheets, sprite, view.panX - wox, view.panY - woy);
}

render.onEntityAdded = function(entity) {
    RenderManager.updateTransform(entity);
    RenderManager.refreshZBuffer();
};

render.onEntityRemoved = function() {
    RenderManager.refreshZBuffer();
};

render.setWorld = function(world) {
    bgImage = world.image;
    wox = world.imageCenter.x;
    woy = world.imageCenter.y;
    ViewManager.setCenter(wox, woy + 8);
};

module.exports = render;