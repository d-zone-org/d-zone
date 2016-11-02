'use strict';
var System = require('system');

var animate = new System('animate',[
    require('com-sprite3d'),
    require('com-animation')
]);

animate.updateEntity = function(entity, sprite, animation) {
    if(animation.complete) return;
    if(animation.init) { // First frame initialization
        animation.tick = 0; // Sub-frame tick
        sprite.sheetW = animation.frameW;
        sprite.sheetH = animation.frameH;
        animation.init = false;
    }
    if(animation.rate > 1) { // If not changing frame on every tick
        animation.tick = animation.tick < animation.rate ? animation.tick + 1 : 1;
        if(animation.tick > 1) return; // Only animate on first tick
    }
    
    sprite.sheetX = animation.originX + animation.frame * animation.frameW * animation.deltaX;
    sprite.sheetY = animation.originY + animation.frame * animation.frameH * animation.deltaY;

    animation.frame++;
    if(animation.frame === animation.frames) {
        if(animation.loop) animation.frame = 0;
        else animation.complete = true;
    }
};

module.exports = animate;