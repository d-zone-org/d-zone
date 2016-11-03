'use strict';

module.exports = Animation;

function Animation() {
    this.data = {
        init: true,
        loop: true,
        rate: 2, // Game ticks per frame
        frames: 12,
        frame: 0,
        originX: 0,
        originY: 0,
        frameW: 20,
        frameH: 20,
        deltaX: 1,
        deltaY: 0,
        offsetX: 0,
        offsetY: 0
    };
}