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
    this.on('update',this.onUpdate);
}

WorldObject.prototype.move = function(x,y,z) {
    var newX = this.position.x + x;
    var newY = this.position.y + y;
    var newZ = this.position.z + z;
    this.game.world.moveObject(this,newX,newY,newZ);
    var oldZDepth = this.zDepth;
    this.zDepth = this.calcZDepth();
    this.game.renderer.updateZBuffer(oldZDepth, this);
};

WorldObject.prototype.onUpdate = function() {
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