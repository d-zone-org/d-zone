'use strict';
var EntityManager = require('man-entity');
var actorConfig = require('actor-cfg');
var util = require('dz-util');

var SPRITE3D = require('com-sprite3d');
var MOVEMENT = require('actor/com-movement');
var ANIMATION = require('com-animation');

module.exports = {
    create: function(sprite) {
        var data = [
            [SPRITE3D, actorConfig().sprites.idle.east]
        ];
        if(sprite) util.mergeObjects(data[0][1], sprite); // Apply custom data
        return data;
    },
    hop: function(entity, direction) {
        if(EntityManager.hasComponent(entity, MOVEMENT)) return;
        EntityManager.addComponent(entity, MOVEMENT, { direction: direction });
        EntityManager.addComponent(entity, ANIMATION, actorConfig().animations.hop[direction]);
    }
};