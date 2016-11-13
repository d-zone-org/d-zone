'use strict';
var WorldGeneration = require('./generation');
var WorldGraphics = require('world/graphics');
var EntityManager = require('man-entity');
var ComponentManager = require('man-component');
var SpriteManager = require('man-sprite');
var worldConfig = require('./config');

var world, entityMap, colliderData, spriteData;

module.exports = {
    generateWorld: function(size) {
        world = WorldGeneration.generateMap(size);
        entityMap = world.entityMap;
        // console.log(world);
        addEntity(EntityManager.addEntity([
            [require('com-sprite3d'), worldConfig().beacon],
            [require('com-collider'), { platform: false }]
        ]), 0, 0);
        SpriteManager.waitForLoaded(function() {
            WorldGraphics.drawWorld(world, SpriteManager.sheets);
            require('sys-render').setWorld(world);
        });
        colliderData = ComponentManager.getComponentData([require('com-collider')])[0];
        spriteData = ComponentManager.getComponentData([require('com-sprite3d')])[0];
    },
    addEntity: addEntity,
    getEntityAt: function(x, y, z) {
        x = center(x);
        y = center(y);
        var xy = entityMap.getXY(x, y);
        for(var i = 0; i < xy.length; i++) {
            if(getEntityZ(xy[i]) === z) return xy[i];
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
    entityMap: entityMap
};

function addEntity(e, x, y) {
    x = center(x);
    y = center(y);
    world.entityMap.getXY(x || 0, y || 0).push(e);
}

function getEntityZ(e) {
    if(colliderData[e]) return colliderData[e].z;
    else if(spriteData[e]) return spriteData[e].z;
    else return false;
}

function center(n) {
    return (n || 0) + world.radius;
}