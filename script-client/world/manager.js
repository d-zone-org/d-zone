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
            [require('com-sprite3d'), worldConfig().beacon],
            [require('com-transform'), { platform: false }]
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
    getSurface: function(x, y, z, maxDown, maxUp) {
        x = center(x);
        y = center(y);
        var xy = entityMap.getXY(x, y);
        for(var i = 0; i < xy.length; i++) {
            
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