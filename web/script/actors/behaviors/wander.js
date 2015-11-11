'use strict';
var Geometry = require('./../../common/geometry.js');
var util = require('./../../common/util.js');

module.exports = Wander;

function Wander(actor) {
    this.actor = actor;
    this.state = 'idle';
    this.listeners = [];
    
    this.addListener(this.actor,'collision', function() {
        if(this.state == 'moving') {
            this.state = 'idle';
            this.heading = false;
        }
    });
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
};

Wander.prototype.addListener = function(emitter, event, handler) {
    emitter.on(event, handler.bind(this));
    this.listeners.push({ emitter: emitter, event: event, handler: handler });
};

Wander.prototype.detach = function() { // Detach behavior from actor
    for(var i = 0; i < this.listeners.length; i++) {
        this.listeners[i].emitter.removeListener(this.listeners[i].event,this.listeners[i].handler);
    }
    delete this.actor;
    delete this.listeners;
};