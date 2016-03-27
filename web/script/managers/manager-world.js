'use strict';
var WorldGeneration = require('./world/world-generation');
var WorldGraphics = require('./world/world-graphics');
var RenderSystem = require('./../systems/system-render');
var SpriteManager = require('./../managers/manager-sprite');

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