'use strict';
var WorldGeneration = require('world-generation');
var WorldGraphics = require('world-graphics');
var RenderSystem = require('system-render');
var SpriteManager = require('manager-sprite');

var world, collisionMap;

module.exports = {
    generateWorld: function(size) {
        world = WorldGeneration.generateMap(size);
        // console.log(world);
        SpriteManager.waitForLoaded(function() {
            WorldGraphics.drawWorld(world,SpriteManager.sprites);
            RenderSystem.setWorld(world);
        });
    },
    collisionMap: collisionMap
};