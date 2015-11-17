'use strict';
var inherits = require('inherits');
var Geometry = require('./../common/geometry.js');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');
var Placeholder = require('./placeholder.js');
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
    this.destination = false;
    this.impulseInterval = 1000;
    this.facing = util.pickInObject(Geometry.DIRECTIONS);
    this.behaviors = [];
    setTimeout(this.newImpulse.bind(this),Math.random() * this.impulseInterval);
}

Actor.prototype.onUpdate = function() {
    if(this.destination) this.doMove();
};

Actor.prototype.updatePresence = function(presence) {
    // TODO: Lower saturation on role colored sprite when offline
    this.presence = presence ? presence : 'offline';
    if(this.presence == 'offline' || this.presence == 'idle') {
        for(var i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].detach();
        }
        this.behaviors = [];
    } else if(this.behaviors.length == 0) { // If coming online and have no behaviors already
        this.behaviors.push(new Wander(this));
    }
};

Actor.prototype.getSprite = function() {
    if(!this.sheet) return;
    var facing = this.facing, state = this.destination ? 'hopping' : this.presence;
    if(!this.destination && this.talking) {
        state = 'online';
        facing = facing == 'north' ? 'east' : facing == 'west' ? 'south' : facing;
    }
    var metrics = JSON.parse(JSON.stringify(this.sheet.map[state][facing]));
    if(!this.destination && this.talking) {
        metrics.y += (Math.floor(this.game.ticks / 4) % 4) * metrics.h;
    } else if(this.destination) {
        var frame = Math.floor((this.game.ticks - this.moveStart)/3) + 1;
        metrics.x += (frame - 1) * metrics.w;
        var animation = this.sheet.map['hopping'].animation;
        if(frame >= animation.zStartFrame) {
            if(this.destination.z > this.position.z) {
                metrics.oy -= Math.min(8,frame + 1 - animation.zStartFrame);
            } else if(this.destination.z < this.position.z) {
                metrics.oy += Math.min(8, frame + 1 - animation.zStartFrame);
            }
        }
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
    for(var i = 0; i < this.behaviors.length; i++) {
        this.behaviors[i].impulse();
    }
    setTimeout(this.newImpulse.bind(this), 200 + Math.random() * this.impulseInterval);
};

Actor.prototype.tryMove = function(x,y,z) {
    if(this.game.world.objectAtXYZ(this.position.x,this.position.y,this.position.z+this.height)) {
        this.emit('getoffme');
        return; // Can't move with object on top
    }
    var newX = this.position.x + x;
    var newY = this.position.y + y;
    var newZ = this.position.z + z;
    var canMove = false;
    var obstruction = this.game.world.objectAtXYZ(newX,newY,newZ);
    if(obstruction) {
        if(!obstruction.invalid && !obstruction.destination
            && obstruction.position.z + obstruction.height <= newZ + 0.5
            && !this.game.world.objectAtXYZ(newX,newY,newZ+0.5)) { // Climb up
            
            canMove = { x: newX, y: newY, z: obstruction.position.z + obstruction.height };
        }
    } else {
        var under = this.game.world.objectUnderXYZ(newX,newY,newZ);
        if(under && !under.invalid && !under.destination 
            && under.position.z + under.height >= newZ - 0.5) { // Level or hop down
            canMove = { x: newX, y: newY, z: under.position.z + under.height };
        }
    }
    return canMove;
};

Actor.prototype.startMove = function() {
    this.moveStart = this.game.ticks;
    this.movePlaceholder = new Placeholder(this,this.destination.x,this.destination.y,this.destination.z);
};

Actor.prototype.doMove = function() {
    var animation = this.sheet.map['hopping'].animation;
    var tick = this.game.ticks - this.moveStart;
    var halfZDepthFrame = this.facing == 'south' || this.facing == 'east';
    if(tick == animation.frames * 3 - 1) {
        this.emit('movecomplete');
        delete this.movePlaceholder;
        this.move(this.destination.x, this.destination.y, this.destination.z, true);
        this.destination = false;
        delete this.moveStart;
    } else if(halfZDepthFrame && tick == 5 * 3 - 1) { // Move zDepth half-way between tiles
        var previousZDepth1 = this.zDepth;
        var destDelta = { x: this.destination.x - this.position.x, y: this.destination.y - this.position.y };
        this.zDepth = (this.position.x + this.position.y + (destDelta.x + destDelta.y)/2);
        this.game.renderer.updateZBuffer(previousZDepth1, this);
    } else if(tick == 9 * 3 - 1) { // Move zDepth all the way
        var previousZDepth2 = this.zDepth;
        this.zDepth = this.destination.x + this.destination.y;
        this.game.renderer.updateZBuffer(previousZDepth2, this);
    }
};

Actor.prototype.move = function(x, y, z, absolute) {
    if(x == 0 && y == 0 && z == 0) return;
    var newX = (absolute ? 0 : this.position.x) + x;
    var newY = (absolute ? 0 : this.position.y) + y;
    var newZ = (absolute ? 0 : this.position.z) + z;
    this.game.world.moveObject(this,newX,newY,newZ);
    var previousZDepth = this.zDepth;
    this.zDepth = this.calcZDepth();
    if(previousZDepth != this.zDepth) this.game.renderer.updateZBuffer(previousZDepth, this);
};