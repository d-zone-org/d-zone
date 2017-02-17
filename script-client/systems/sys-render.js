'use strict';
var util = require('dz-util');
var System = require('system');
var RenderManager = require('man-render');
var SpriteManager = require('man-sprite');
var ComponentManager = require('man-component');
var ViewManager = require('man-view.js');
var requestAnimationFrame = require('raf');
var PIXI = require('pixi.js');

var renderer = PIXI.autoDetectRenderer(100, 100, { antialias: false, backgroundColor: 0x1d171f }),
    stage = new PIXI.Container();

PIXI.loader.add('img/actors.png').load(function() {
    var actorTexture = new PIXI.Texture(PIXI.loader.resources['img/actors.png'].texture,
        new PIXI.Rectangle(0,0,14,14));
    var actorSprite = new PIXI.Sprite(actorTexture);
    actorSprite.x = -5;
    actorSprite.y = -5;
    stage.addChild(actorSprite);
});


ViewManager.init(renderer, stage);

var view = ViewManager.view;
var currentFrame;
var bgSegments, bgSegmentWidth, bgSegmentHeight;

var renderSystem = new System([
    require('com-sprite3d')
]);

renderSystem.update = function() { // Overrides update method to wait for browser animation frame
    // Insert loading screen here
};
SpriteManager.waitForLoaded(function() { // Wait for sprite sheets to load
    
    renderSystem.update = update; // Change update method to start drawing game
});

function update() { // Real update method once sprites are loaded
    requestAnimationFrame.cancel(currentFrame); // Cancel current frame request
    currentFrame = requestAnimationFrame(render); // Request new frame
}

var renderTime = 0, frameCount = 0;
function render() {
    frameCount++;
    var renderStart = performance.now();
    renderer.render(stage);
    renderTime += performance.now() - renderStart;
    if(frameCount == 500) { frameCount = 0; console.log('avg game render time',renderTime/500); renderTime = 0; }
}

renderSystem.onEntityAdded = function(entity) {
    RenderManager.updateTransform(entity);
};

renderSystem.setBGSegments = function(segments, w, h) {
    bgSegments = segments;
    bgSegmentWidth = w;
    bgSegmentHeight = h;
};

module.exports = renderSystem;