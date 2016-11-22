'use strict';
var util = require('dz-util');
var WorldGeneration = require('./generation');
var WorldGraphics = require('world/graphics');
var EntityManager = require('man-entity');
var ComponentManager = require('man-component');
var SpriteManager = require('man-sprite');
var worldConfig = require('./config');
var PathManager = require('./path/pathmanager');

var world, entityMap, collisionMap, transformData;

var worldManager = {
    generateWorld(size) {
        transformData = ComponentManager.getComponentData([require('com-transform')])[0];
        world = WorldGeneration.generateMap(size);
        worldManager.world = world;
        entityMap = world.entityMap;
        collisionMap = world.collisionMap;
        PathManager.init(collisionMap);
        addEntity(EntityManager.addEntity([
            [require('com-transform'), { platform: false }],
            [require('com-sprite3d'), worldConfig().beacon]
        ]));
        SpriteManager.waitForLoaded(function() {
            WorldGraphics.drawWorld(world, SpriteManager.sheets);
            require('sys-render').setWorld(world);
        });
    },
    addEntity: addEntity,
    removeEntity: removeEntity,
    getEntitiesAt: getEntitiesAt,
    getSurfaceZ(x, y, z, maxDown, maxUp) {
        x = center(x);
        y = center(y);
        var collisionColumn = collisionMap.getXY(x, y);
        var closest = -100;
        for(var i = Math.max(0, z - maxDown); i <= Math.min(15, z + maxUp); i++) {
            if((collisionColumn >> (i * 2) & 3) == 1) { // Does this Z have a platform and no solid block?
                if(i === z) return z; // Same Z preferred
                if(Math.abs(i - closest) >= Math.abs(i - z)) closest = i; // Get closest Z
            }
        }
        return closest;
    },
    moveEntity(e, x, y, z) {
        var transform = removeEntity(e);
        transform.x += x;
        transform.y += y;
        transform.z += z;
        addEntity(e);
    },
    getPath: PathManager.getPath
};

function addEntity(e) {
    var transform = getTransform(e);
    var centeredX = center(transform.x),
        centeredY = center(transform.y);
    transform.mapIndex = entityMap.indexFromXY(centeredX, centeredY);
    entityMap.getIndex(transform.mapIndex).push(e);
    if(transform.solid || transform.platform) { // Update collision map
        var entityCollision = transform.solid ? 1 : 0;
        if(transform.platform) entityCollision += 2;
        entityCollision <<= transform.z * 2 + 1; // Shift up 2 bits per Z, plus 1 bit for terrain
        collisionMap.setIndex(transform.mapIndex, collisionMap.getIndex(transform.mapIndex) | entityCollision);
        var collisionColumn = collisionMap.getIndex(transform.mapIndex);
        collisionMap.setIndex(transform.mapIndex, collisionColumn | entityCollision);
    }
    return transform;
}

function removeEntity(e) {
    var transform = getTransform(e);
    util.removeFromArray(e, entityMap.getIndex(transform.mapIndex));
    if(transform.solid || transform.platform) { // Update collision map
        var entityCollision = transform.solid ? 1 : 0;
        if(transform.platform) {
            entityCollision += 2;
            var remainingEntities = getEntitiesAt(transform.x, transform.y, transform.z);
            for(var i = 0; i < remainingEntities.length; i++) {
                if(getTransform(remainingEntities[i]).platform) { // If a remaining entity is a platform
                    entityCollision -= 2; // Don't remove platform bit from collision map
                    break;
                }
            }
        }
        entityCollision <<= transform.z * 2 + 1;
        collisionMap.setIndex(transform.mapIndex, collisionMap.getIndex(transform.mapIndex) & ~entityCollision);
    }
    return transform;
}

function getEntitiesAt(x, y, z) {
    x = center(x);
    y = center(y);
    var xy = entityMap.getXY(x, y);
    var entities = [];
    for(var i = 0; i < xy.length; i++) {
        if(getTransform(xy[i]).z === z) entities.push(xy[i]);
    }
    return entities;
}

function getTransform(e) {
    return transformData[e] || {};
}

function center(n) {
    return (n || 0) + world.radius;
}

function unCenter(n) {
    return (n || 0) - world.radius;
}

module.exports = worldManager;