'use strict';
var inherits = require('inherits');
var Entity = require('./entity.js');

module.exports = WorldObject;
inherits(WorldObject, Entity);

function WorldObject(options) {
    this.position = {
        x: options.position.x,
        y: options.position.y,
        z: options.position.z
    };
    if(!options.velocity) options.velocity = { x: 0, y: 0, z: 0 };
    this.velocity = {
        x: options.velocity.x,
        y: options.velocity.y,
        z: options.velocity.z
    };
}

WorldObject.prototype.move = function(velocity) {
    this.position.x += velocity.x;
    this.position.y += velocity.y;
    this.position.z += velocity.z;
};