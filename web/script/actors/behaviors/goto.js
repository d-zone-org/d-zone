'use strict';
var Geometry = require('./../../common/geometry.js');
var util = require('./../../common/util.js');
var Pathfinder = require('./../pathfinder.js');

module.exports = GoTo;

function GoTo(actor, destination) {
    this.actor = actor;
    this.destination = destination;
    if(this.actor.destination) {
        this.actor.once('movecomplete', this.startGoTo.bind(this));
    } else {
        this.startGoTo();
    }
}

GoTo.prototype.startGoTo = function() {
    console.log('pathing');
    this.path = Pathfinder.findPath({ start: this.actor.position, end: this.destination });
    //for(var i = 0; i < this.path.length; i++) {
    //    console.log(this.path[i].x,this.path[i].y,this.path[i].z);
    //}
    //this.actor.game.paused = true;
    if(this.path[0]) { // If there is a path
        this.actor.destination = { x: this.path[0].x, y: this.path[0].y, z: this.path[0].z };
        this.actor.startMove();
        this.actor.once('movecomplete', this.startGoTo.bind(this));
    } else { // If no path, try adjacent tile
        
    }
};

GoTo.prototype.detach = function() { // Detach behavior from actor
    delete this.actor;
};