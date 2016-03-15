'use strict';
var WorldGeneration = require('./world/world-generation');

var collisionMap;

module.exports = {
    generateWorld: WorldGeneration.generate,
    collisionMap: collisionMap
};