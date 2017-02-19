'use strict';

module.exports = Movement;

function Movement(data) {
    this.data = Object.assign({
        direction: 'east', // Direction of movement
        ticks: 1 // Duration
    }, data);
}