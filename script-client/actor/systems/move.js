'use strict';
var System = require('system');
var EntityManager = require('man-entity');
var RenderManager = require('man-render');
var actorConfig = require('actor/config');
var util = require('dz-util');

var MOVEMENT = require('actor/components/movement');

var move = new System('move',[
    require('com-sprite3d'),
    MOVEMENT
]);

move.updateEntity = function(entity, sprite, movement) {
    if(!movement.tick) {
        movement.tick = 0;
        util.mergeObjects(movement, actorConfig().movement[movement.direction]);
    }
    if(movement.tick < movement.ticks) {
        movement.tick++;
    } else {
        EntityManager.removeComponent(entity, MOVEMENT);
        sprite.x += movement.dx || 0;
        sprite.y += movement.dy || 0;
        sprite.z += movement.dz || 0;
        RenderManager.updateSprite(entity);
        util.mergeObjects(sprite, actorConfig().sprites.idle[movement.direction]); // Set actor direction
    }
};

module.exports = move;