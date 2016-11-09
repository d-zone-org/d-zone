'use strict';
var System = require('system');
var EntityManager = require('man-entity');
var RenderManager = require('man-render');

var ANIMATION = require('com-animation');

var animate = new System('animate',[
    require('com-sprite3d'),
    ANIMATION
]);

animate.updateEntity = function(entity, sprite, animation) {
    if(!animation.frame) {
        // First frame initialization
        animation.frame = 0;
        animation.tick = 0; // Sub-frame tick
        if(!sprite.prev) sprite.prev = { // Preserve original sprite params before animating
            sheetX: sprite.sheetX,
            sheetY: sprite.sheetY,
            sheetW: sprite.sheetW,
            sheetH: sprite.sheetH
        };
        sprite.sheetW = animation.frameW;
        sprite.sheetH = animation.frameH;
        sprite.fdx = sprite.dx + animation.offsetX;
        sprite.fdy = sprite.dy + animation.offsetY;
    }
    if(animation.rate > 1) { // If not changing frame on every tick
        animation.tick = animation.tick < animation.rate ? animation.tick + 1 : 1;
        if(animation.tick > 1) return; // Only animate on first tick
    }
    // Advance animation frame
    sprite.sheetX = animation.sheetX + animation.frame * animation.frameW * animation.deltaX;
    sprite.sheetY = animation.sheetY + animation.frame * animation.frameH * animation.deltaY;
    if(animation.frame < animation.frames) { // If animation not completed
        animation.frame++;
        var zDepthChange = animation.zDepthValues[animation.zDepthFrames.indexOf(animation.frame)];
        if(zDepthChange) {
            sprite.zDepth += zDepthChange;
            RenderManager.refreshZBuffer();
        }
    } else { // If final frame reached
        if(animation.loop) animation.frame = 0;
        else {
            // Restore original sprite properties
            sprite.sheetX = sprite.prev.sheetX;
            sprite.sheetY = sprite.prev.sheetY;
            sprite.sheetW = sprite.prev.sheetW;
            sprite.sheetH = sprite.prev.sheetH;
            delete sprite.prev;
            sprite.fdx = sprite.dx + sprite.dox;
            sprite.fdy = sprite.dy + sprite.doy;
            EntityManager.removeComponent(entity, ANIMATION); // Remove animation component
        }
    }
};

module.exports = animate;