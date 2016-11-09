'use strict';
var EntityManager = require('man-entity');
var actorConfig = require('actor-cfg');
var util = require('dz-util');

var SPRITE3D = require('com-sprite3d');
var MOVEMENT = require('com-movement');
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
        var moveData;
        switch(direction) {
            case 'north': moveData = { dx: 0, dy: -1 }; break;
            case 'west': moveData = { dx: -1, dy: 0 }; break;
            case 'south': moveData = { dx: 0, dy: 1 }; break;
            case 'east': moveData = { dx: 1, dy: 0 }; break;
        }
        moveData.ticks = 26;
        EntityManager.addComponent(entity, MOVEMENT, moveData);
        EntityManager.addComponent(entity, ANIMATION, actorConfig().animations.hop[direction]);
    }
};