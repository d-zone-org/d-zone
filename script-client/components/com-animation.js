'use strict';

module.exports = Animation;

function Animation() {
    this.data = {
        loop: true,
        restoreSprite: true, // Indicates whether to restore sprite properties upon completion
        rate: 2, // Game ticks per frame
        frames: 12,
        frame: 0,
        sheetX: 0,
        sheetY: 0,
        frameW: 20,
        frameH: 20,
        deltaX: 1,
        deltaY: 0,
        offsetX: 0,
        offsetY: 0,
        zDepthFrames: [], // Frames at which zDepth of sprite is manually changed
        zDepthValues: [], // Relative values to change zDepth, corresponding to zDepthFrames
        offsetYFrames: [], // Frames at which offsetY of sprite is manually changed
        offsetYValues: [] // Relative values to change offsetY, corresponding to offsetYFrames
    };
}