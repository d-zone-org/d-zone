'use strict';
var WorldGeneration = require('world/generation');
var WorldGraphics = require('world/graphics');
var EntityManager = require('man-entity');
var SpriteManager = require('man-sprite');
var worldConfig = require('./config');

var world, entityMap;

module.exports = {
    generateWorld: function(size) {
        world = WorldGeneration.generateMap(size);
        // console.log(world);
        EntityManager.addEntity([[require('com-sprite3d'), worldConfig().beacon]]);
        SpriteManager.waitForLoaded(function() {
            WorldGraphics.drawWorld(world, SpriteManager.sheets);
            require('sys-render').setWorld(world);
        });
    },
    entityMap: entityMap
};