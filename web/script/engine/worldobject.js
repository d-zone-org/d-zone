'use strict';
var inherits = require('inherits');
var Entity = require('./entity.js');
var Geometry = require('./../common/geometry.js');

module.exports = WorldObject;
inherits(WorldObject, Entity);

function WorldObject(options) {
    this.position = {
        x: options.position.x,
        y: options.position.y,
        z: options.position.z
    };
    this.zDepth = this.calcZDepth();
    this.pixelSize = {
        x: options.pixelSize.x,
        y: options.pixelSize.y,
        z: options.pixelSize.z
    };
    if(!options.velocity) options.velocity = { x: 0, y: 0, z: 0 };
    this.velocity = {
        x: options.velocity.x,
        y: options.velocity.y,
        z: options.velocity.z
    };
    this.on('update',this.onUpdate);
}

WorldObject.prototype.stopped = function() {
    return this.velocity.x == 0 && this.velocity.y == 0 && this.velocity.z == 0;
};

WorldObject.prototype.onUpdate = function() {
    this.move(this.velocity);
};

WorldObject.prototype.move = function(velocity, noClip) {
    if(velocity.x == 0 && velocity.y == 0 && velocity.z == 0) return;
    if(this.game.world.objectAtXYZ(this.position.x,this.position.y,this.position.z+this.height)) {
        this.emit('getoffme');
        return; // Can't move with object on top
    }
    var newX = this.position.x + velocity.x;
    var newY = this.position.y + velocity.y;
    var newZ = this.position.z + velocity.z;
    var success = false;
    var obstruction = this.game.world.objectAtXYZ(newX,newY,newZ);
    if(!noClip && obstruction) {
        if(obstruction.position.z + obstruction.height <= newZ + 0.5
            && !this.game.world.objectAtXYZ(newX,newY,newZ+0.5)) {
            newZ = obstruction.position.z + obstruction.height;
            success = true;
        } else {
            this.velocity = { x: 0, y: 0, z: 0 };
            this.emit('collision');
        }
    } else if(!noClip) {
        var under = this.game.world.objectUnderXYZ(newX,newY,newZ);
        if(under && under.position.z + under.height >= newZ - 0.5) {
            newZ = under.position.z + under.height;
            success = true;
        } else {
            this.velocity = { x: 0, y: 0, z: 0 };
            this.emit('collision');
        }
    }
    if(noClip || success) {
        this.game.world.moveObject(this,this.position.x,this.position.y,this.position.z,newX,newY,newZ);
        var oldZDepth = this.zDepth;
        this.zDepth = this.calcZDepth();
        this.game.renderer.updateZBuffer(oldZDepth, this);
    }
};

WorldObject.prototype.calcZDepth = function() {
    return this.position.x + this.position.y/* + this.position.z/10 - (this.height || 0)*/;
};

WorldObject.prototype.toScreen = function() {
    return {
        x: (this.position.x - this.position.y) * 16 - this.pixelSize.x,
        y: (this.position.x + this.position.y) * 8 - (this.position.z - this.height) * 16
    };
};

WorldObject.prototype.getSprite = function() {
    // Return generic sprite
};