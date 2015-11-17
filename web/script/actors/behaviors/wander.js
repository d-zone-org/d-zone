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
    if(this.state == 'moving' || this.actor.talking) return;
    var direction = util.pickInObject(Geometry.DIRECTIONS);
    var moveXY = Geometry.DIRECTIONS[direction];
    this.actor.facing = direction;
    var canMove = this.actor.tryMove(moveXY.x, moveXY.y, 0);
    if(canMove) {
        this.actor.destination = canMove;
        this.actor.startMove();
        this.state = 'moving';
        this.actor.once('movecomplete', this.impulseComplete.bind(this))
    }
};

Wander.prototype.impulseComplete = function() {
    this.state = 'idle';
};

Wander.prototype.detach = function() { // Detach behavior from actor
    this.actor.removeAllListeners('movecomplete',this.impulseComplete.bind(this));
    delete this.actor;
};