'use strict';
var Geometry = require('./../../common/geometry.js');
var util = require('./../../common/util.js');
var Pathfinder = require('./../pathfinder.js');

module.exports = GoTo;

function GoTo(actor, target) {
    this.actor = actor;
    this.target = target;
    this.attempt = util.randomIntRange(1,4);
    this.boundStartGoTo = this.startGoTo.bind(this);
    if(this.actor.destination) {
        this.actor.once('movecomplete', this.boundStartGoTo);
    } else {
        this.startGoTo();
    }
    var self = this;
    this.resetAttempt = function() {
        self.attempt = util.randomIntRange(1,4);
    };
    this.target.on('movecomplete', this.resetAttempt); // Reset adjacent attempts if target moves
}

GoTo.prototype.startGoTo = function() {
    if(!this.actor) return;
    var adjacent = Geometry.closestGrids[this.attempt]; // Pick grid next to target
    var targetDistance = Geometry.getDistance(this.actor.position,this.target.position);
    if(targetDistance <= Math.abs(adjacent[0])+Math.abs(adjacent[1])) {
        this.actor.stopGoTo(this);
        return;
    }
    this.destination = {
        x: this.target.position.x + adjacent[0], y: this.target.position.y + adjacent[1]
    };
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
};

GoTo.prototype.detach = function() { // Detach behavior from actor
    this.actor.removeListener('movecomplete',this.boundStartGoTo);
    this.target.removeListener('movecomplete',this.resetAttempt);
    delete this.actor;
    delete this.target;
};