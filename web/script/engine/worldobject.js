'use strict';
var inherits = require('inherits');
var Entity = require('./entity.js');

module.exports = WorldObject;
inherits(WorldObject, Entity);

function WorldObject(options) {
    Entity.call(this);
    this.position = {
        x: options.position.x,
        y: options.position.y,
        z: options.position.z,
        fakeZ: 0
    };
    this.height = options.height;
    this.zDepth = this.calcZDepth();
    this.screen = {};
    this.updateScreen();
    this.sprite.screen = this.screen;
    this.sprite.position = this.position;
}

WorldObject.prototype.moveTo = function(x,y,z) {
    var deltaX = x - this.position.x,
        deltaY = y - this.position.y,
        deltaZ = z - this.position.z;
    if(deltaX == 0 && deltaY == 0 && deltaZ == 0) return;
    this.game.world.moveObject(this,x,y,z);
    this.updateScreen();
    var newZDepth = this.calcZDepth();
    if(newZDepth != this.zDepth) {
        this.game.renderer.updateZBuffer(this.zDepth, this.sprite, newZDepth);
        this.zDepth = newZDepth;
    }
};

WorldObject.prototype.underneath = function() {
    return this.game.world.objectAtXYZ(this.position.x,this.position.y,this.position.z+this.height);
};

WorldObject.prototype.calcZDepth = function() {
    return this.position.x + this.position.y;
};

WorldObject.prototype.updateScreen = function() {
    this.screen.x = (this.position.x - this.position.y) * 16;
    this.screen.y = (this.position.x + this.position.y) * 8 - (this.position.z + this.height) * 16;
};