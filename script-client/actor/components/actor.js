'use strict';

module.exports = Actor;

function Actor() {
    this.data = {
        userID: '', // Discord user ID
        username: '', // Discord username
        facing: 'east',
        status: 'online'
    };
}