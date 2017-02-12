'use strict';

module.exports = Message;

function Message() {
    this.data = {
        message: '', // Text content
        rate: 3 // Game ticks per message char
    };
}