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
    this.fakeZ = 0;
    this.height = options.height;
    this.zDepth = this.calcZDepth();
    this.pixelSize = {
        x: options.pixelSize.x,
        y: options.pixelSize.y,
        z: options.pixelSize.z
    };
    this.screen = this.toScreen();
}

WorldObject.prototype.move = function(x,y,z) {
    var newX = this.position.x + x;
    var newY = this.position.y + y;
    var newZ = this.position.z + z;
    this.game.world.moveObject(this,newX,newY,newZ);
    this.screen = this.toScreen();
    //var oldZDepth = this.zDepth;
    this.game.renderer.updateZBuffer(this.zDepth, this, this.calcZDepth());
    this.zDepth = this.calcZDepth();
};

WorldObject.prototype.calcZDepth = function() {
    return this.position.x + this.position.y;
};

WorldObject.prototype.toScreen = function() {
    return {
        x: (this.position.x - this.position.y) * 16 - this.pixelSize.x,
        y: (this.position.x + this.position.y) * 8 - (this.position.z + this.height) * 16
    };
};

WorldObject.prototype.getSprite = function() {
    // Return generic sprite
};