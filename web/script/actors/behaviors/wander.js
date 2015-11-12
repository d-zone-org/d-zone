'use strict';
var Geometry = require('./../../common/geometry.js');
var util = require('./../../common/util.js');

module.exports = Wander;

function Wander(actor) {
    this.actor = actor;
    this.state = 'idle';
    this.listeners = [];
}

Wander.prototype.impulse = function() {
    if(this.state != 'idle') return; // Maybe just replace this with a velocity check
    if(!this.heading) {
        this.heading = util.pickInObject(Geometry.DIRECTIONS);
    }
    this.actor.velocity = {
        x: Geometry.DIRECTIONS[this.heading].x/3, y: Geometry.DIRECTIONS[this.heading].y/3, z: 0
    };
    this.actor.facing = this.heading;
    this.state = 'moving';
    this.actor.removeAllListeners('collision',this.onCollision.bind(this)); // Clear any previous listeners
    this.actor.once('collision', this.onCollision.bind(this));
};

Wander.prototype.detach = function() { // Detach behavior from actor
    this.actor.removeAllListeners('collision',this.onCollision.bind(this));
    delete this.actor;
};

Wander.prototype.onCollision = function() {
    if(this.state == 'moving') {
        this.state = 'idle';
        this.heading = false;
    }
};