'use strict';
var Geometry = require('./../../common/geometry.js');

module.exports = Wander;

function Wander(actor) {
    this.actor = actor;
    this.state = 'idle';
    
    var self = this;
    this.actor.on('impulse', function() {
        if(self.state != 'idle') return;
        if(!self.heading) {
            self.heading = Geometry.randomDirection();
        }
        self.actor.velocity = {
            x: self.heading.x, y: self.heading.y, z: 0
        };
        self.state = 'moving';
    });
    this.actor.on('collision', function() {
        if(self.state == 'moving') {
            self.state = 'idle';
            self.heading = false;
        }
    });
}