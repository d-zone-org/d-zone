'use strict';
var WorldGeneration = require('./world/world-generation');
var WorldGraphics = require('./world/world-graphics');

var world, collisionMap;

module.exports = {
    generateWorld: function(size) {
        world = WorldGeneration.generateMap(size);
        world.image = WorldGraphics.drawWorld(world);
    },
    world: world,
    collisionMap: collisionMap
};