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
    this.size = {
        x: options.size.x,
        y: options.size.y,
        z: options.size.z
    };
    if(!options.velocity) options.velocity = { x: 0, y: 0, z: 0 };
    this.velocity = {
        x: options.velocity.x,
        y: options.velocity.y,
        z: options.velocity.z
    };
    this.on('update',function(interval) {
        this.move(this.velocity);
    });
}

WorldObject.prototype.stopped = function() {
    return this.velocity.x == 0 && this.velocity.y == 0 && this.velocity.z == 0;
};

WorldObject.prototype.move = function(velocity) {
    if(velocity.x == 0 && velocity.y == 0 && velocity.z == 0) return;
    this.position.x += velocity.x;
    this.position.y += velocity.y;
    this.position.z += velocity.z;
    var blocked = false, objs = this.game.entities;
    for(var i = 0; i < objs.length; i++) {
        if(this === objs[i]) continue;
        if(this.overlaps(objs[i])) {
            this.position.x -= velocity.x;
            this.position.y -= velocity.y;
            this.position.z -= velocity.z;
            this.emit('collision');
            blocked = true;
            break;
        }
    }
    if(blocked) this.velocity = { x: 0, y: 0, z: 0 };
};

WorldObject.prototype.toScreen = function() {
    return {
        x: this.position.x - this.size.x / 2 - this.position.y - this.size.y / 2,
        y: (this.position.x - this.size.x / 2 + this.position.y - this.size.y / 2) / 2 - this.position.z - this.size.z
    };
};

WorldObject.prototype.overlaps = function(obj) {
    return Geometry.intervalOverlaps(
            this.position.x - this.size.x/2, this.position.x + this.size.x/2, 
            obj.position.x - obj.size.x/2, obj.position.x + obj.size.x/2
        ) && Geometry.intervalOverlaps(
            this.position.y - this.size.y/2, this.position.y + this.size.y/2, 
            obj.position.y - obj.size.y/2, obj.position.y + obj.size.y/2
        ) && Geometry.intervalOverlaps(
            this.position.z, this.position.z + this.size.z, 
            obj.position.z, obj.position.z + obj.size.z
        );
};

WorldObject.prototype.projectionOverlaps = function(obj) {
    var xa = this.position.x - this.size.x/2, ya = this.position.y - this.size.y/2, za = this.position.z, 
        xxa = xa + this.size.x, yya = ya + this.size.y, zza = za + this.size.z, 
        xb = obj.position.x - obj.size.x/2, yb = obj.position.y - obj.size.y/2, zb = obj.position.z, 
        xxb = xb + obj.size.x, yyb = yb + obj.size.y, zzb = zb + obj.size.z;
    return Geometry.intervalOverlaps(xa-yya, xxa-ya, xb-yyb, xxb-yb) 
        && Geometry.intervalOverlaps(xa-zza, xxa-za, xb-zzb, xxb-zb) 
        && Geometry.intervalOverlaps(-yya+za, -ya+zza, -yyb+zb, -yb+zzb);
};

WorldObject.prototype.isBehind = function(obj) {
    return this.projectionOverlaps(obj) && (
        this.position.x + this.size.x/2 <= obj.position.x - obj.size.x/2 || 
        this.position.y + this.size.y/2 <= obj.position.y - obj.size.y/2 || 
        this.position.z + this.size.z <= obj.position.z
        );
};

WorldObject.prototype.supports = function(obj) {
    return this.position.z + this.size.z == obj.position.z &&
        Geometry.intervalOverlaps(
            this.position.x - this.size.x/2, this.position.x + this.size.x/2, 
            obj.position.x - obj.size.x/2, obj.position.x + obj.size.x/2
        ) && Geometry.intervalOverlaps(
            this.position.y - this.size.y/2, this.position.y + this.size.y/2, 
            obj.position.y - obj.size.y/2, obj.position.y + obj.size.y/2
        );
};