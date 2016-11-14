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
    require('com-transform'),
    MOVEMENT
]);

move.updateEntity = function(entity, actor, sprite, transform, movement) {
    if(!movement.tick) { // Initialize movement
        actor.facing = movement.direction;
        util.mergeObjects(sprite, actorConfig().sprites.idle[actor.facing]); // Set actor facing direction
        var moveDelta = actorConfig().movement[movement.direction];
        var targetX = transform.x + moveDelta.dx,
            targetY = transform.y + moveDelta.dy;
        var surfaceZ = WorldManager.getSurfaceZ(targetX, targetY, transform.z, 1, 1);
        if(surfaceZ < 0) return cancelMove(entity); // No valid surface
        var hopAnimation = actorConfig().animations.hop[movement.direction];
        movement.dz = surfaceZ - transform.z;
        if(movement.dz > 0) util.mergeObjects(hopAnimation, actorConfig().animations.hopUp);
        else if (movement.dz < 0) util.mergeObjects(hopAnimation, actorConfig().animations.hopDown);
        movement.tick = 0;
        util.mergeObjects(movement, moveDelta);
        EntityManager.addComponent(entity, ANIMATION, hopAnimation);
    }
    if(movement.tick < movement.ticks) {
        movement.tick++;
    } else {
        WorldManager.moveEntity(entity, movement.dx, movement.dy, movement.dz);
        RenderManager.updateTransform(entity);
        cancelMove(entity);
    }
};

function cancelMove(entity) {
    EntityManager.removeComponent(entity, MOVEMENT);
}

module.exports = move;