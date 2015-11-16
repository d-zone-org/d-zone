'use strict';
var inherits = require('inherits');
var Geometry = require('./../common/geometry.js');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');
var Wander = require('./behaviors/wander.js');
var ColorUtil = require('./../common/colorutil.js');

module.exports = Actor;
inherits(Actor, WorldObject);

function Actor(x,y,z) {
    WorldObject.call(this, {position:{x:x,y:y,z:z},pixelSize:{x:7,y:7,z:8}});
    this.height = 0.5;
    this.sheet = new Sheet('actor');
    var self = this;
    this.on('draw',function(canvas) {
        if(self.exists) canvas.drawImageIso(self);
    });
    this.presence = 'offline';
    this.talking = false;
    this.facing = util.pickInObject(Geometry.DIRECTIONS);
    this.behaviors = [];
    setTimeout(this.newImpulse.bind(this),Math.random() * 3000);
}

Actor.prototype.updatePresence = function(presence) {
    // TODO: Lower saturation on role colored sprite when offline
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
    if(this.listenerCount('collision') > 1) console.error('>1 listener!',this);
};

Actor.prototype.getSprite = function() {
    if(!this.sheet) return;
    var facing = this.facing, presence = this.presence;
    if(this.talking) {
        presence = 'online';
        facing = facing == 'north' ? 'east' : facing == 'west' ? 'south' : facing;
    }
    var metrics = JSON.parse(JSON.stringify(this.sheet.map[presence][facing]));
    if(this.talking) {
        metrics.y += (Math.floor(this.game.ticks / 4) % 4) * metrics.h;
    }
    return {
        metrics: metrics,
        image: this.sheet.image || this.sheet.getSprite()
    };
};

Actor.prototype.setRoleColor = function(color) {
    if(!color) return;
    this.roleColor = color;
    if(this.sheet.image) { // If image already loaded
        this.sheet.image = ColorUtil.colorize(this.sheet.image, color, 0.75);
    } else { // Else wait for image to load
        var self = this;
        this.sheet.onLoad(function() {
            self.sheet.image = ColorUtil.colorize(self.sheet.getSprite(), color, 0.75);
        });
    }
};

Actor.prototype.newImpulse = function() {
    if(this.stopped()) {
        for(var i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].impulse();
        }
    }
    setTimeout(this.newImpulse.bind(this), 200 + Math.random() * 3000);
};

Actor.prototype.move = function(velocity) {
    if(!this.talking) WorldObject.prototype.move.call(this, velocity);
};