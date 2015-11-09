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
    var actor = new WorldObject({position:{x:x,y:y,z:z},size:{x:7,y:7,z:8}});
    this.object = actor;
    actor.sheet = new Sheet('actor');
    actor.getSprite = function() {
        return actor.sheet.map[actor.facing];
    };
    actor.on('draw',function(canvas) {
        canvas.drawImageIso(actor);
    });
    actor.facing = util.pickInObject(Geometry.DIRECTIONS);
    actor.behaviors = [new Wander(actor)];
    function newImpulse() {
        if(actor.stopped()) actor.emit('impulse');
        setTimeout(newImpulse,Math.random() * 3000);
    }
    setTimeout(newImpulse,Math.random() * 3000);
    return actor;
}