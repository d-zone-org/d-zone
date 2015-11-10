'use strict';
var Geometry = require('./../../common/geometry.js');
var util = require('./../../common/util.js');

module.exports = Wander;

function Wander(actor) {
    this.actor = actor;
    this.state = 'idle';
    
    var self = this;
    this.actor.on('collision', function() {
        if(self.state == 'moving') {
            self.state = 'idle';
            self.heading = false;
        }
    });
}

Wander.prototype.impulse = function() {
    if(this.state != 'idle') return;
    if(!this.heading) {
        this.heading = util.pickInObject(Geometry.DIRECTIONS);
    }
    this.actor.velocity = {
        x: Geometry.DIRECTIONS[this.heading].x/4, y: Geometry.DIRECTIONS[this.heading].y/4, z: 0
    };
    this.actor.facing = this.heading;
    this.state = 'moving';
};