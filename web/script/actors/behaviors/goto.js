'use strict';
var Geometry = require('./../../common/geometry.js');
var util = require('./../../common/util.js');

module.exports = GoTo;

function GoTo(actor) {
    this.actor = actor;
    this.state = 'idle';
    this.listeners = [];
    this.impulseCompleteBound = this.impulseComplete.bind(this);
}

GoTo.prototype.impulse = function() {
    if(this.state == 'moving' || this.actor.talking) return;
    this.state = 'moving';
    this.actor.once('movecomplete', this.impulseCompleteBound)
};

GoTo.prototype.impulseComplete = function() {
    this.state = 'idle';
};

GoTo.prototype.detach = function() { // Detach behavior from actor
    this.actor.removeListener('movecomplete',this.impulseCompleteBound);
    delete this.actor;
};