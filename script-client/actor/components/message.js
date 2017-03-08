'use strict';

module.exports = Message;

function Message(data) {
    this.data = Object.assign({
        message: '', // Text content
        rate: 1, // Game ticks per message char
        newMessages: [] // Messages received while this message still active
    }, data);
}