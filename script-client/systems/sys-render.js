'use strict';
var util = require('dz-util');
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
var spriteSheets, backgroundColor = '#1d171f', wox, woy;
var bgSegments, bgSegmentWidth, bgSegmentHeight;

view.events.once('ready', function() {
    render.update = function() { // Overrides update method to wait for browser animation frame
        // Insert loading screen here
    };
    SpriteManager.waitForLoaded(function() { // Wait for sprite sheets to load
        spriteSheets = SpriteManager.sheets;
        render.update = update; // Change update method to start drawing game
    });
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
    if(bgSegments) for(var sx = 0; sx < bgSegments.length; sx++) {
        for(var sy = 0; sy < bgSegments[sx].length; sy++) {
            if(!bgSegments[sx][sy]) continue;
            view.canvas.drawImage(bgSegments[sx][sy], 0, 0, bgSegmentWidth, bgSegmentHeight,
                sx * bgSegmentWidth - util.clampWrap(view.panX, 0, bgSegmentWidth),
                sy * bgSegmentHeight - util.clampWrap(view.panY, 0, bgSegmentHeight));
        }
    }
    for(var s = 0; s < zBuffer.length; s++) {
        renderSprite(zBuffer[s]);
    }
    // renderTime += performance.now() - renderStart;
    // if(frameCount == 500) { frameCount = 0; console.log('avg frame render time',renderTime/500); renderTime = 0; }
    // previousFrame = currentFrame;
}

function renderSprite(sprite) {
    view.canvas.drawSprite(spriteSheets, sprite, view.panX - wox, view.panY - woy);
}

render.onEntityAdded = function(entity) {
    RenderManager.updateTransform(entity);
};

render.onEntityRemoved = function(removedEntities) {
    for(var i = 0; i < removedEntities.length; i++) {
        RenderManager.removeSprite(removedEntities[i]);
    }
};

render.setBGSegments = function(segments) {
    bgSegments = segments;
};

render.setWorld = function(world) {
    wox = world.imageCenter.x;
    woy = world.imageCenter.y;
    bgSegmentWidth = world.segmentImageSize.w;
    bgSegmentHeight = world.segmentImageSize.h;
    ViewManager.setCenter(wox, woy + 8);
};

module.exports = render;