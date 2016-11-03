'use strict';
var EntityManager = require('man-entity');
var System = require('system');

var animate = new System('animate',[
    require('com-sprite3d'),
    require('com-animation')
]);

animate.updateEntity = function(entity, sprite, animation) {
    if(animation.init) {
        // First frame initialization
        animation.tick = 0; // Sub-frame tick
        animation.original = {
            sheetX: sprite.sheetX,
            sheetY: sprite.sheetY,
            sheetW: sprite.sheetW,
            sheetH: sprite.sheetH,
            dx: sprite.dx,
            dy: sprite.dy
        };
        sprite.sheetW = animation.frameW;
        sprite.sheetH = animation.frameH;
        sprite.dx -= sprite.dox - animation.offsetX; // Undo sprite offset and apply animation offset
        sprite.dy -= sprite.doy - animation.offsetY;
        animation.init = false;
    }
    if(animation.rate > 1) { // If not changing frame on every tick
        animation.tick = animation.tick < animation.rate ? animation.tick + 1 : 1;
        if(animation.tick > 1) return; // Only animate on first tick
    }
    // Advance animation frame
    sprite.sheetX = animation.originX + animation.frame * animation.frameW * animation.deltaX;
    sprite.sheetY = animation.originY + animation.frame * animation.frameH * animation.deltaY;
    animation.frame++;
    if(animation.frame === animation.frames) { // If final frame reached
        if(animation.loop) animation.frame = 0;
        else {
            // Restore original sprite properties
            sprite.sheetX = animation.original.sheetX;
            sprite.sheetY = animation.original.sheetY;
            sprite.sheetW = animation.original.sheetW;
            sprite.sheetH = animation.original.sheetH;
            sprite.dx = animation.original.dx;
            sprite.dy = animation.original.dy;
            EntityManager.removeComponent(entity, animate.components[1]); // Remove animation component
        }
    }
};

module.exports = animate;