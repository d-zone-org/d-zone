'use strict';
var System = require('system');
var EntityManager = require('man-entity');
var RenderManager = require('man-render');

var ANIMATION = require('com-animation');

var animate = new System([
    require('com-sprite3d'),
    ANIMATION
]);

animate.updateEntity = function(entity, sprite, animation) {
    // if(animation.stop) return stopAnimate(entity, sprite, animation);
    // if(!animation.init) {
    //     // First frame initialization
    //     animation.init = true;
    //     animation.tick = 0; // Sub-frame tick
    //     if(animation.restoreSprite && !sprite.prev) sprite.prev = { // Preserve original sprite params before animating
    //         sheetX: sprite.sheetX,
    //         sheetY: sprite.sheetY,
    //         sheetW: sprite.sheetW,
    //         sheetH: sprite.sheetH,
    //         dox: sprite.dox,
    //         doy: sprite.doy
    //     };
    //     sprite.sheetW = animation.frameW;
    //     sprite.sheetH = animation.frameH;
    //     sprite.dox = animation.offsetX;
    //     sprite.doy = animation.offsetY;
    //     RenderManager.updateSprite(entity);
    // }
    // var newFrame = true;
    // if(animation.rate > 1) { // If not changing frame on every tick
    //     newFrame = animation.tick % animation.rate === 0; // Only animate on first tick
    // }
    // if(newFrame) {
    //     animation.frame = Math.floor(animation.tick / animation.rate);
    //     if(animation.loop && animation.frame === animation.frames) {
    //         animation.tick = 0;
    //         animation.frame = 0;
    //     }
    //     if(animation.frame < animation.frames) { // If animation not completed
    //         // Draw new frame
    //         sprite.sheetX = animation.sheetX + animation.frame * animation.frameW * animation.deltaX;
    //         sprite.sheetY = animation.sheetY + animation.frame * animation.frameH * animation.deltaY;
    //         var zDepthChange = animation.zDepthValues[animation.zDepthFrames.indexOf(animation.frame)];
    //         if(zDepthChange) RenderManager.adjustZDepth(entity, sprite, zDepthChange);
    //         var offsetYChange = animation.offsetYValues[animation.offsetYFrames.indexOf(animation.frame)];
    //         if(offsetYChange) {
    //             sprite.doy += offsetYChange;
    //             RenderManager.updateSprite(entity);
    //         }
    //     } else stopAnimate(entity, sprite, animation); // If final frame reached
    // }
    // animation.tick++;
};

function stopAnimate(entity, sprite, animation) {
    if(animation.restoreSprite) { // Restore original sprite properties
        sprite.sheetX = sprite.prev.sheetX;
        sprite.sheetY = sprite.prev.sheetY;
        sprite.sheetW = sprite.prev.sheetW;
        sprite.sheetH = sprite.prev.sheetH;
        sprite.dox = sprite.prev.dox;
        sprite.doy = sprite.prev.doy;
        delete sprite.prev;
        RenderManager.updateSprite(entity);
    }
    EntityManager.removeComponent(entity, ANIMATION);
}

module.exports = animate;