'use strict';
var WorldGeneration = require('world/generation');
var WorldGraphics = require('world/graphics');
var RenderSystem = require('sys-render');
var EntityManager = require('man-entity');
var SpriteManager = require('man-sprite');
var worldConfig = require('./config');

var world, entityMap;

module.exports = {
    generateWorld: function(size) {
        EntityManager.addEntity([[require('com-sprite3d'), worldConfig().beacon]]);
        world = WorldGeneration.generateMap(size);
        
        // console.log(world);
        SpriteManager.waitForLoaded(function() {
            WorldGraphics.drawWorld(world, SpriteManager.sprites);
            RenderSystem.setWorld(world);
        });
    },
    entityMap: entityMap
};