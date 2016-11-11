'use strict';
var WorldGeneration = require('world/generation');
var WorldGraphics = require('world/graphics');
var RenderSystem = require('sys-render');
var EntityManager = require('man-entity');
var SpriteManager = require('man-sprite');

var world, collisionMap;

module.exports = {
    generateWorld: function(size) {
        EntityManager.addEntity([[require('com-sprite3d'), { // Beacon
            sheet: 'props',
            sheetX: 0,
            sheetY: 0,
            sheetW: 31,
            sheetH: 56,
            dox: -16,
            doy: -42
        }]]);
        world = WorldGeneration.generateMap(size);
        // console.log(world);
        SpriteManager.waitForLoaded(function() {
            WorldGraphics.drawWorld(world,SpriteManager.sprites);
            RenderSystem.setWorld(world);
        });
    },
    collisionMap: collisionMap
};