'use strict';
var System = require('system');
var EntityManager = require('man-entity');
var RenderManager = require('man-render');

var MOVEMENT = require('actor/com-movement');

var move = new System('move',[
    require('com-sprite3d'),
    MOVEMENT
]);

move.updateEntity = function(entity, sprite, movement) {
    if(!movement.tick) movement.tick = 0;
    if(movement.tick < movement.ticks) {
        movement.tick++;
    } else {
        EntityManager.removeComponent(entity, MOVEMENT);
        sprite.x += movement.dx;
        sprite.y += movement.dy;
        sprite.z += movement.dz;
        RenderManager.updateSprite(entity);
    }
};

module.exports = move;