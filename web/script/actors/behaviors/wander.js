'use strict';
var Geometry = require('./../../common/geometry.js');
var util = require('./../../common/util.js');

module.exports = Wander;

function Wander(actor) {
    this.actor = actor;
    this.state = 'idle';
    
    var self = this;
    this.actor.on('impulse', function() {
        if(self.state != 'idle') return;
        if(!self.heading) {
            self.heading = util.pickInObject(Geometry.DIRECTIONS);
        }
        self.actor.velocity = {
            x: Geometry.DIRECTIONS[self.heading].x, y: Geometry.DIRECTIONS[self.heading].y, z: 0
        };
        self.actor.facing = self.heading;
        self.state = 'moving';
    });
    this.actor.on('collision', function() {
        if(self.state == 'moving') {
            self.state = 'idle';
            self.heading = false;
        }
    });
}