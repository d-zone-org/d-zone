'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');
var Wander = require('./behaviors/wander.js');

var spriteX = 0;
var spriteY = 0;
var spriteWidth = 14;
var spriteHeight = 14;
var sheet = new Sheet({
    actor: { x: spriteX, y: spriteY, width: spriteWidth, height: spriteHeight }
});

module.exports = Actor;
inherits(Actor, WorldObject);

function Actor(x,y,z) {
    var actor = new WorldObject({position:{x:x,y:y,z:z},size:{x:6.5,y:6.5,z:8}});
    actor.on('draw',function(canvas) {
        if(!sheet.sprite.loaded) return;
        canvas.drawImageIso(sheet.sprite.img,spriteX,spriteY,spriteWidth,spriteHeight,actor);
    });
    actor.behaviors = [new Wander(actor)];
    function newImpulse() {
        if(actor.stopped()) actor.emit('impulse');
        setTimeout(newImpulse,Math.random() * 3000);
    }
    setTimeout(newImpulse,Math.random() * 3000);
    return actor;
}