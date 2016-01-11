'use strict';
var Geometry = require('./../../common/geometry.js');
var util = require('./../../common/util.js');
var Pathfinder = require('./../pathfinder.js');

module.exports = GoTo;

function GoTo(actor, target) {
    this.actor = actor;
    this.target = target;
    this.attempt = util.randomIntRange(1,4);
    this.boundResetAttempt = this.resetAttempt.bind(this);
    this.target.on('movecomplete', this.boundResetAttempt); // Reset adjacent attempts if target moves
    this.boundStartGoTo = this.startGoTo.bind(this);
    if(this.actor.destination) {
        this.actor.once('movecomplete', this.boundStartGoTo);
    } else {
        this.startGoTo();
    }
}

GoTo.prototype.startGoTo = function() {
    if(!this.actor || this.actor.presence != 'online' || this.actor.underneath()) return;
    var adjacent = Geometry.closestGrids[this.attempt]; // Pick grid next to target
    var targetDistance = Geometry.getDistance(this.actor.position,this.target.position);
    if(targetDistance <= Math.abs(adjacent[0])+Math.abs(adjacent[1])) {
        this.actor.stopGoTo(this);
        return;
    }
    this.destination = {
        x: this.target.position.x + adjacent[0], y: this.target.position.y + adjacent[1]
    };
    var destDelta = { 
        x: this.destination.x - this.actor.position.x, 
        y: this.destination.y - this.actor.position.y 
    };
    var moveDir = {
        x: Math.abs(destDelta.x) > Math.abs(destDelta.y) ? Math.max(-1,Math.min(1,destDelta.x)) : 0,
        y: Math.abs(destDelta.y) >= Math.abs(destDelta.x) ? Math.max(-1,Math.min(1,destDelta.y)) : 0
    };
    var moveAttempt = this.actor.tryMove(moveDir.x,moveDir.y);
    if(moveAttempt) { // Try to move in the general direction of our target
        this.actor.destination = moveAttempt;
        this.actor.startMove();
        this.actor.once('movecomplete', this.boundStartGoTo);
    } else { // If moving toward target is blocked, find a path
        this.path = Pathfinder.findPath({ start: this.actor.position, end: this.destination });
        if(this.path[0]) { // If there is a path
            //this.attempt = util.randomIntRange(1,4); // Reset adjacent attempts
            this.actor.destination = { x: this.path[0].x, y: this.path[0].y, z: this.path[0].z };
            this.actor.startMove();
            this.actor.once('movecomplete', this.boundStartGoTo);
        } else { // If no path, try next closest tile
            this.attempt++;
            this.startGoTo();
        }
    }
};

GoTo.prototype.resetAttempt = function() {
    this.attempt = util.randomIntRange(1,4);
};

GoTo.prototype.detach = function() { // Detach behavior from actor
    if(this.actor) this.actor.removeListener('movecomplete',this.boundStartGoTo);
    if(this.target) this.target.removeListener('movecomplete',this.boundResetAttempt);
    delete this.actor;
    delete this.target;
};