'use strict';
var WorldGeneration = require('./world/world-generation');

var world, collisionMap;

module.exports = {
    generateWorld: function(size) {
        world = WorldGeneration.generateMap(size);
    },
    world: world,
    collisionMap: collisionMap
};