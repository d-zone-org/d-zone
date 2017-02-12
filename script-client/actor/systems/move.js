'use strict';
var System = require('system');
var EntityManager = require('man-entity');
var WorldManager = require('world/manager');
var RenderManager = require('man-render');
var ActorManager = require('actor/manager');
var actorConfig = require('../config');

var MOVEMENT = require('../components/movement');
var ANIMATION = require('com-animation');

var move = new System([
    require('../components/actor'),
    require('com-sprite3d'),
    require('com-transform'),
    MOVEMENT
]);

move.updateEntity = function(entity, actor, sprite, transform, movement) {
    if(!movement.tick) { // Initialize movement
        ActorManager.turn(entity, movement.direction);
        var moveDelta = actorConfig().movement[movement.direction];
        if(WorldManager.isSolid(transform.x, transform.y, transform.z + 1)) return stopMove(entity); // Solid above
        var targetX = transform.x + moveDelta.dx,
            targetY = transform.y + moveDelta.dy;
        var surfaceZ = WorldManager.getSurfaceZ(targetX, targetY, transform.z, 1, 1);
        if(surfaceZ < 0) return stopMove(entity); // No valid surface
        // All clear to move
        WorldManager.makeSolid(targetX, targetY, surfaceZ); // Reserve the place I'm moving to
        WorldManager.removePlatform(transform.x, transform.y, transform.z + 1); // Not platform when moving
        var hopAnimation = actorConfig().animations.hop[movement.direction];
        movement.dz = surfaceZ - transform.z;
        if(movement.dz > 0) Object.assign(hopAnimation, actorConfig().animations.hopUp);
        else if (movement.dz < 0) Object.assign(hopAnimation, actorConfig().animations.hopDown);
        movement.tick = 0;
        Object.assign(movement, moveDelta);
        EntityManager.addComponent(entity, ANIMATION, hopAnimation);
    }
    if(movement.tick < movement.ticks) {
        if(movement.tick === 4) WorldManager.removeEntity(entity); // Origin is free now
        movement.tick++;
    } else {
        transform.x += movement.dx;
        transform.y += movement.dy;
        transform.z += movement.dz;
        WorldManager.addEntity(entity);
        RenderManager.updateTransform(entity);
        stopMove(entity);
    }
};

function stopMove(entity) {
    EntityManager.removeComponent(entity, MOVEMENT);
}

module.exports = move;