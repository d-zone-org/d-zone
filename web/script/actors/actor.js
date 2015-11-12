'use strict';
var inherits = require('inherits');
var Geometry = require('./../common/geometry.js');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');
var Wander = require('./behaviors/wander.js');
var ColorUtil = require('./colorutil.js');

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
    if(this.listenerCount('collision') > 1) console.error('>1 listener!',this);
};

Actor.prototype.getSprite = function() {
    var image = this.sheet.image || this.sheet.getSprite();
    return {
        metrics: this.sheet.map[this.presence][this.facing],
        image: image
    }
};

Actor.prototype.setRoleColor = function(color) {
    if(!color) return;
    this.roleColor = color;
    if(this.sheet.image) { // If image already loaded
        this.sheet.image = ColorUtil.colorize(this.sheet.image, color);
    } else { // Else wait for image to load
        var self = this;
        this.sheet.onLoad(function() {
            self.sheet.image = ColorUtil.colorize(self.sheet.getSprite(), color);
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