'use strict';

module.exports = Actor;

function Actor(data) {
    this.data = Object.assign({
        userID: '', // Discord user ID
        username: '', // Discord username
        facing: 'east',
        status: 'online'
    }, data);
}