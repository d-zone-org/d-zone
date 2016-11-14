'use strict';
var util = require('dz-util');
var WorldGeneration = require('./generation');
var WorldGraphics = require('world/graphics');
var EntityManager = require('man-entity');
var ComponentManager = require('man-component');
var SpriteManager = require('man-sprite');
var worldConfig = require('./config');

var world, entityMap, transformData;

module.exports = {
    generateWorld: function(size) {
        transformData = ComponentManager.getComponentData([require('com-transform')])[0];
        world = WorldGeneration.generateMap(size);
        entityMap = world.entityMap;
        // console.log(world);
        addEntity(EntityManager.addEntity([
            [require('com-transform'), { platform: false }],
            [require('com-sprite3d'), worldConfig().beacon]
        ]), 0, 0);
        SpriteManager.waitForLoaded(function() {
            WorldGraphics.drawWorld(world, SpriteManager.sheets);
            require('sys-render').setWorld(world);
        });
    },
    addEntity: addEntity,
    getEntityAt: function(x, y, z) {
        x = center(x);
        y = center(y);
        var xy = entityMap.getXY(x, y);
        for(var i = 0; i < xy.length; i++) {
            if(getTransform(xy[i]).z === z) return xy[i];
        }
        return -1;
    },
    getSurfaceZ: function(x, y, z, maxDown, maxUp) {
        x = center(x);
        y = center(y);
        var entXY = entityMap.getXY(x, y);
        var tileXY = world.tiles.getXY(x, y);
        if(entXY.length === 0) { // No entities
            if(!tileXY || z - maxDown > 0) return -1; // No tile or tile too far down
            return 0; // Tile in reach
        }
        var column = {}; // Possible obstacles and platforms in range, indexed by Z
        for(var i = 0; i < entXY.length; i++) {
            var t = getTransform(entXY[i]);
            if(!t.solid) continue; // Non-solid entities don't matter
            if(t.z < z - maxDown - 1 || t.z > z + maxUp) continue; // Out of range (1 lower included for platforms)
            column[t.z] = t.platform;
        }
        for(var u = z; u <= z + maxUp; u++) { // Look up
            if(column[u] !== undefined) continue; // This Z is blocked
            if(column[u-1] || (u == 0 && tileXY)) return u; // There is a platform or tile to sit on
        }
        for(var d = z - 1; d >= z - maxDown; d--) { // Look down
            if(column[d] !== undefined) continue; // This Z is blocked
            if(column[d-1] || tileXY) return d; // There is a platform or tile to sit on
        }
    },
    moveEntity: function(e, x, y, z) {
        var transform = removeEntity(e);
        transform.x += x;
        transform.y += y;
        transform.z += z;
        addEntity(e, transform.x, transform.y);
    }
};

function addEntity(e, x, y) {
    x = center(x);
    y = center(y);
    var transform = getTransform(e);
    transform.mapIndex = entityMap.indexFromXY(x, y);
    entityMap.getIndex(transform.mapIndex).push(e);
    return transform;
}

function removeEntity(e) {
    var transform = getTransform(e);
    util.removeFromArray(e, entityMap.getIndex(transform.mapIndex));
    return transform;
}

function getTransform(e) {
    return transformData[e] || {};
}

function center(n) {
    return (n || 0) + world.radius;
}