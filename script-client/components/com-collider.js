'use strict';

module.exports = Collider;

function Collider() {
    this.data = {
        x: 0,
        y: 0,
        z: 0,
        platform: true // Other colliders can "sit" on top
    };
}