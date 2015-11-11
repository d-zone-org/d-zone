'use strict';
var inherits = require('inherits');
var Geometry = require('./../common/geometry.js');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');
var Wander = require('./behaviors/wander.js');

module.exports = Actor;
inherits(Actor, WorldObject);

function Actor(x,y,z) {
    WorldObject.call(this, {position:{x:x,y:y,z:z},size:{x:7,y:7,z:8}});
    var self = this;
    this.sheet = new Sheet('actor');
    this.on('draw',function(canvas) {
        canvas.drawImageIso(self);
    });
    this.presence = 'offline';
    this.facing = util.pickInObject(Geometry.DIRECTIONS);
    this.behaviors = [];
    setTimeout(this.newImpulse.bind(this),Math.random() * 3000);
}

Actor.prototype.updatePresence = function(presence) {
    this.presence = presence ? presence : 'offline';
    if(this.presence == 'offline' || this.presence == 'idle') {
        for(var i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].detach();
        }
        this.behaviors = [];
        this.velocity = { x: 0, y: 0, z: 0 };
    } else if(this.behaviors.length == 0) { // If coming online and have no behaviors already
        this.behaviors.push(new Wander(this));
    }
    if(this.behaviors.length > 1) console.error('>1 behavior!',this.presence,this);
    if(this.listenerCount > 1) console.error('>1 listener!',this.presence,this);
};

Actor.prototype.getSprite = function() {
    var presence = this.presence == 'idle' ? 'online' : this.presence;
    return this.sheet.map[presence][this.facing];
};

Actor.prototype.newImpulse = function() {
    if(this.stopped()) {
        for(var i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].impulse();
        }
    }
    setTimeout(this.newImpulse.bind(this),200+Math.random() * 3000);
};