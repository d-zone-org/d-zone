'use strict';
var util = require('dz-util');
var Geometry = require('geometry');
var EntityManager = require('man-entity');
var SpriteManager = require('man-sprite');
var WorldManager = require('world/manager');
var Sprites = require('./sprites');
var actorConfig = require('./config');

var ACTOR = require('./components/actor');
var SPRITE3D = require('com-sprite3d');
var TRANSFORM = require('com-transform');
var MOVEMENT = require('./components/movement');
var MESSAGE = require('./components/message');
var actorData, spriteData, transformData, movementData, messageData;

var freeMapIndexes, currentFreeMapIndexes, placeZ = 0;

module.exports = {
    init(getComponentData) {
        actorData = getComponentData(ACTOR);
        spriteData = getComponentData(SPRITE3D);
        transformData = getComponentData(TRANSFORM);
        movementData = getComponentData(MOVEMENT);
        messageData = getComponentData(MESSAGE);
        freeMapIndexes = WorldManager.world.tiles.getTiles([2,3], [WorldManager.world.tiles.indexFromXY(WorldManager.world.radius, WorldManager.world.radius)]);
        currentFreeMapIndexes = freeMapIndexes.slice(0);
    },
    create({ x, y, z, color }) {
        var transform = { x, y, z };
        if(isNaN(transform.x) && isNaN(transform.y) && isNaN(transform.z)) {
            var { x: randomX, y: randomY } = getRandomFreeTile();
            transform.x = WorldManager.unCenter(randomX);
            transform.y = WorldManager.unCenter(randomY);
            transform.z = placeZ;
        }
        var facing = util.pickInObject(Geometry.DIRECTIONS); // Face random direction
        // var sprite = actorConfig().sprites.idle[facing]; 
        // sprite.sheet = 'actors';
        var actor = { facing };
        if(!isNaN(color)) {
            actor.color = color;
            // sprite.sheet = SpriteManager.getColorSheet('actors', params.color, 0.8,
            //     [{ alpha: 0.4, x: 14, y: 42, w: 14, h: 28 }]);
        }
        var data = [
            [ACTOR, actor],
            [TRANSFORM, transform], // Transform must be before sprite so render manager sees it when sprite is added
            [SPRITE3D, Sprites.createActorSprite(facing)] 
        ];
        var e = EntityManager.addEntity(data);
        transform = WorldManager.addEntity(e);
        util.removeFromArray(transform.mapIndex % WorldManager.world.tiles.area, currentFreeMapIndexes);
        if(!currentFreeMapIndexes.length) {
            placeZ++;
            currentFreeMapIndexes = freeMapIndexes.slice(0);
        }
        return e;
    },
    hop(entity, direction) {
        if(movementData[entity] || messageData[entity]) return;
        EntityManager.addComponent(entity, MOVEMENT, { direction });
    },
    message(entity, message) {
        if(messageData[entity]) messageData[entity].newMessages.push(message);
        else EntityManager.addComponent(entity, MESSAGE, { message });
    },
    turn(entity, direction) {
        actorData[entity].facing = direction;
        Sprites.turn(spriteData[entity], direction);
    }
};

function getRandomFreeTile() {
    return WorldManager.world.tiles.XYFromIndex(util.pickInArray(currentFreeMapIndexes));
}