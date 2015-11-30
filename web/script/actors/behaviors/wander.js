'use strict';
var Geometry = require('./../../common/geometry.js');
var util = require('./../../common/util.js');

module.exports = Wander;

function Wander(actor) {
    this.actor = actor;
    this.state = 'idle';
    this.impulseCompleteBound = this.impulseComplete.bind(this);
    this.impulseInterval = 75;
    this.impulseBound = this.impulse.bind(this);
    this.wait();
}

Wander.prototype.wait = function() {
    this.actor.tickDelay(this.impulseBound, 15 + Math.round(Math.random() * this.impulseInterval));
};

Wander.prototype.impulse = function() {
    console.log('wander impulse');
    if(this.state == 'moving' || this.actor.talking) {
        // Busy
    } else {
        var direction = util.pickInObject(Geometry.DIRECTIONS);
        var moveXY = Geometry.DIRECTIONS[direction];
        var canMove = this.actor.tryMove(moveXY.x, moveXY.y);
        if(canMove) {
            this.actor.destination = canMove;
            this.actor.startMove();
            this.state = 'moving';
            this.actor.once('movecomplete', this.impulseCompleteBound)
        }
    }
    this.wait();
};

Wander.prototype.impulseComplete = function() {
    this.state = 'idle';
};

Wander.prototype.detach = function() { // Detach behavior from actor
    this.actor.removeListener('movecomplete',this.impulseCompleteBound);
    this.actor.removeFromSchedule(this.impulseBound);
    delete this.actor;
};