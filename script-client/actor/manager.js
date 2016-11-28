'use strict';
var util = require('dz-util');
var Geometry = require('geometry');
var EntityManager = require('man-entity');
var SpriteManager = require('man-sprite');
var WorldManager = require('world/manager');
var RenderManager = require('man-render');
var actorConfig = require('./config');

var ACTOR = require('./components/actor');
var SPRITE3D = require('com-sprite3d');
var TRANSFORM = require('com-transform');
var MOVEMENT = require('./components/movement');

var placedIndexes = [WorldManager.world.tiles.indexFromXY(WorldManager.world.radius, WorldManager.world.radius)];
var placeZ = 0;

module.exports = {
    create(params) {
        params = params || {};
        var transform = {};
        if(params.x) transform.x = params.x;
        if(params.y) transform.y = params.y;
        if(params.z) transform.z = params.z;
        if(isNaN(transform.x) && isNaN(transform.y) && isNaN(transform.z)) {
            var random = WorldManager.world.tiles.getRandomTile([2,3], placedIndexes);
            if(!random) {
                placeZ++;
                placedIndexes = placedIndexes.slice(0,1);
                random = WorldManager.world.tiles.getRandomTile([2,3], placedIndexes);
            }
            transform.x = WorldManager.unCenter(random.xy.x);
            transform.y = WorldManager.unCenter(random.xy.y);
            transform.z = placeZ;
        }
        var sprite = actorConfig().sprites.idle[util.pickInObject(Geometry.DIRECTIONS)]; // Face random direction
        sprite.sheet = 'actors';
        var actor = {};
        if(!isNaN(params.color)) {
            actor.color = params.color;
            sprite.sheet = SpriteManager.getColorSheet('actors', params.color, 0.8,
                [{ alpha: 0.4, x: 14, y: 42, w: 14, h: 28 }]);
        }
        var data = [
            [ACTOR, actor],
            [TRANSFORM, transform], // Transform must be before sprite so render manager sees it when sprite is added
            [SPRITE3D, sprite] 
        ];
        var e = EntityManager.addEntity(data);
        transform = WorldManager.addEntity(e);
        placedIndexes.push(transform.mapIndex % WorldManager.world.tiles.area);
        return e;
    },
    hop(entity, direction) {
        if(EntityManager.hasComponent(entity, MOVEMENT)) return;
        EntityManager.addComponent(entity, MOVEMENT, { direction: direction });
    }
};