'use strict';
var System = require('system');
var EntityManager = require('man-entity');
var WorldManager = require('world/manager');
var RenderManager = require('man-render');
var actorConfig = require('actor/config');
var util = require('dz-util');

var MOVEMENT = require('actor/components/movement');
var ANIMATION = require('com-animation');

var move = new System([
    require('actor/components/actor'),
    require('com-sprite3d'),
    MOVEMENT
]);

move.updateEntity = function(entity, actor, sprite, movement) {
    if(!movement.tick) {
        actor.facing = movement.direction;
        util.mergeObjects(sprite, actorConfig().sprites.idle[actor.facing]); // Set actor facing direction
        var moveDelta = actorConfig().movement[movement.direction];
        if(WorldManager.getEntityAt(sprite.x + moveDelta.dx, sprite.y + moveDelta.dy, sprite.z) >= 0) {
            EntityManager.removeComponent(entity, MOVEMENT);
            return;
        }
        movement.dz = 0;
        movement.tick = 0;
        util.mergeObjects(movement, moveDelta);
        EntityManager.addComponent(entity, ANIMATION, actorConfig().animations.hop[movement.direction]);
    }
    if(movement.tick < movement.ticks) {
        movement.tick++;
    } else {
        sprite.x += movement.dx;
        sprite.y += movement.dy;
        sprite.z += movement.dz;
        EntityManager.removeComponent(entity, MOVEMENT);
    }
};

module.exports = move;