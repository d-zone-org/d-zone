'use strict';
var EntityManager = require('man-entity');
var WorldManager = require('world/manager');
var actorConfig = require('./config');
var util = require('dz-util');

var SPRITE3D = require('com-sprite3d');
var MOVEMENT = require('./components/movement');
var ANIMATION = require('com-animation');

module.exports = {
    create: function(sprite) {
        var data = [
            [SPRITE3D, actorConfig().sprites.idle.east]
        ];
        if(sprite) util.mergeObjects(data[0][1], sprite); // Apply custom data
        return EntityManager.addEntity(data);
    },
    hop: function(entity, direction) {
        if(EntityManager.hasComponent(entity, MOVEMENT)) return;
        EntityManager.addComponent(entity, MOVEMENT, { direction: direction });
        EntityManager.addComponent(entity, ANIMATION, actorConfig().animations.hop[direction]);
    }
};