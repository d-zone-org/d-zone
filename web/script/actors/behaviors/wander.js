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
    var direction = util.pickInObject(Geometry.DIRECTIONS);
    this.actor.move({
        x: Geometry.DIRECTIONS[direction].x, y: Geometry.DIRECTIONS[direction].y, z: 0
    });
    this.actor.facing = direction;
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