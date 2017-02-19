'use strict';
var System = require('system');
var RenderManager = require('man-render');
var TextureManager = require('man-texture');
var requestAnimationFrame = require('raf');
var PIXI = require('pixi.js');

var currentFrame;

var renderSystem = new System([
    require('com-sprite3d')
]);

TextureManager.waitForLoaded(function() { // Wait for sprite sheets to load
    renderSystem.update = update; // Change update method to start drawing game
});
renderSystem.update = function() { };
function update() { // Real update method once sprites are loaded
    requestAnimationFrame.cancel(currentFrame); // Cancel current frame request
    currentFrame = requestAnimationFrame(render); // Request new frame
}

// var renderTime = 0, frameCount = 0;
function render() {
    // frameCount++;
    // var renderStart = performance.now();
    RenderManager.render();
    // renderTime += performance.now() - renderStart;
    // if(frameCount == 500) { frameCount = 0; console.log('avg game render time',renderTime/500); renderTime = 0; }
}

renderSystem.onEntityAdded = function(entity) {
    RenderManager.addToStage(entity);
    RenderManager.updateTransform(entity);
};

// Loading bar
var loadBar = new PIXI.Graphics();
loadBar.lineStyle(2, 0xBAB0A8);
loadBar.drawRect(0, 0, 100, 10);
TextureManager.loader.on('progress', function(loader) {
    loadBar.x = Math.floor(RenderManager.renderer.width / 2 - loadBar.width / 2);
    loadBar.y = Math.floor(RenderManager.renderer.height / 2 - loadBar.height / 2);
    loadBar.beginFill(0xBAB0A8);
    loadBar.drawRect(0, 0, loader.progress, 10);
    RenderManager.renderer.render(loadBar);
});

module.exports = renderSystem;