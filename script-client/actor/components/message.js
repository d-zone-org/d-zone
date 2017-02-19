'use strict';

module.exports = Message;

function Message(data) {
    this.data = Object.assign({
        message: '', // Text content
        rate: 3 // Game ticks per message char
    }, data);
}