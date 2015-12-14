'use strict';
var Geometry = require('./../../common/geometry.js');
var util = require('./../../common/util.js');

module.exports = Wander;

function Wander(actor) {
    this.actor = actor;
    this.state = 'idle';
    this.impulseCompleteBound = this.impulseComplete.bind(this);
    this.impulseInterval = 300;
    this.impulseBound = this.impulse.bind(this);
    this.wait();
}

Wander.prototype.wait = function() {
    if(!this.actor) return;
    this.actor.tickDelay(this.impulseBound, 20 + Math.round(Math.random() * this.impulseInterval));
};

Wander.prototype.impulse = function() {
    if(!this.actor || this.actor.presence != 'online') return;
    if(this.actor.destination) { // Busy
        this.wait();
    } else {
        var direction = util.pickInObject(Geometry.DIRECTIONS);
        //direction = util.pickInArray(['east','south']);
        var moveXY = Geometry.DIRECTIONS[direction];
        var canMove = this.actor.tryMove(moveXY.x, moveXY.y);
        if(canMove) {
            this.actor.destination = canMove;
            this.actor.startMove();
            this.actor.once('movecomplete', this.impulseCompleteBound)
        } else {
            this.wait();
        }
    }
};

Wander.prototype.impulseComplete = function() {
    this.wait();
};

Wander.prototype.detach = function() { // Detach behavior from actor
    this.actor.removeListener('movecomplete',this.impulseCompleteBound);
    this.actor.removeFromSchedule(this.impulseBound);
    delete this.actor;
};