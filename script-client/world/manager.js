'use strict';
var util = require('dz-util');
var WorldGeneration = require('./generation');
var WorldGraphics = require('world/graphics');
var EntityMap = require('./entitymap');
var CollisionMap = require('./collisionmap');
var EntityManager = require('man-entity');
var ComponentManager = require('man-component');
var SpriteManager = require('man-sprite');
var worldConfig = require('./config');
var PathManager = require('./path/pathmanager');

var world, transformData;

var worldManager = {
    generateWorld(size) {
        transformData = ComponentManager.getComponentData([require('com-transform')])[0];
        world = WorldGeneration.generateMap(size);
        require('man-render').setWorldSize(world.size);
        worldManager.world = world;
        EntityMap.init(world.size, world.size, 64);
        CollisionMap.init(world.size, world.size, 64, world.tiles);
        PathManager.init(CollisionMap.map);
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
    moveEntity(e, x, y, z) {
        var transform = removeEntity(e);
        transform.x += x;
        transform.y += y;
        transform.z += z;
        addEntity(e);
    },
    getSurfaceZ(x, y, z, maxDown, maxUp) {
        return CollisionMap.getFreePlatform(center(x), center(y), z, maxDown, maxUp);
    },
    makeSolid(x, y, z) { CollisionMap.makeSolid(center(x), center(y), z); },
    removeSolid(x, y, z) { CollisionMap.removeSolid(center(x), center(y), z); },
    makePlatform(x, y, z) { CollisionMap.makePlatform(center(x), center(y), z); },
    removePlatform(x, y, z) { CollisionMap.removePlatform(center(x), center(y), z); },
    isSolid(x, y, z) { return CollisionMap.isSolid(center(x), center(y), z); },
    getPath(e, sx, sy, sz, dx, dy, dz, maxDown, maxUp, cb) {
        removePlatform(sx, sy, sz + 1); // Can't use self as platform
        PathManager.getPath(e, center(sx), center(sy), sz, center(dx), center(dy), dz, maxDown, maxUp, function(path) {
            if(!path) makePlatform(sx, sy, sz + 1);
            cb(path);
        });
    },
    center, unCenter
};

function addEntity(e) {
    var transform = getTransform(e);
    var centeredX = center(transform.x),
        centeredY = center(transform.y);
    transform.mapIndex = EntityMap.map.indexFromXYZ(centeredX, centeredY, transform.z);
    EntityMap.addEntity(transform.mapIndex, e);
    if(transform.solid) CollisionMap.makeSolid(centeredX, centeredY, transform.z);
    if(transform.platform) CollisionMap.makePlatform(centeredX, centeredY, transform.z + 1);
    return transform;
}

function removeEntity(e) {
    var transform = getTransform(e);
    var remainingEntities = EntityMap.removeEntity(transform.mapIndex, e);
    var removeSolid = transform.solid;
    var removePlatform = transform.platform;
    if(remainingEntities && (removePlatform || removeSolid)) { // If at least one entity remains
        for(var i = 0; i < remainingEntities.length; i++) {
            var remainingTransform = getTransform(remainingEntities[i]);
            if(remainingTransform.solid) removeSolid = false;
            if(remainingTransform.platform) removePlatform = false;
        }
    }
    if(removeSolid) CollisionMap.removeSolid(center(transform.x), center(transform.y), transform.z);
    if(removePlatform) CollisionMap.removePlatform(center(transform.x), center(transform.y), transform.z + 1);
    return transform;
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