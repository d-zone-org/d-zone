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
    this.on('update',function(interval) {
        this.move(this.velocity);
    });
}

WorldObject.prototype.move = function(velocity) {
    if(velocity.x == 0 && velocity.y == 0 && velocity.z == 0) return;
    var oldNearness = this.nearness();
    this.position.x += velocity.x;
    this.position.y += velocity.y;
    this.position.z += velocity.z;
    if(oldNearness == this.nearness()) return; // Don't update zBuffer if nearness unchanged
    this.game.renderer.updateZBuffer(this);
};

WorldObject.prototype.nearness = function() {
    return this.position.y - this.position.x + this.position.z;
};