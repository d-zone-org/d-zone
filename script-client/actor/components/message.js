'use strict';

module.exports = Message;

function Message() {
    this.data = {
        message: '', // Text content
        charIndex: 0, // Blit progress
        speed: 1 // Blit speed
    };
}