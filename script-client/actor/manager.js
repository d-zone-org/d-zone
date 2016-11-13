'use strict';
var EntityManager = require('man-entity');
var WorldManager = require('world/manager');
var actorConfig = require('./config');
var util = require('dz-util');

var ACTOR = require('./components/actor');
var SPRITE3D = require('com-sprite3d');
var COLLIDER = require('com-collider');
var MOVEMENT = require('./components/movement');

module.exports = {
    create: function(params) {
        var data = [
            [ACTOR],
            [SPRITE3D, util.mergeObjects(actorConfig().sprites.idle.east, params)],
            [COLLIDER, params]
        ];
        var e = EntityManager.addEntity(data);
        WorldManager.addEntity(e, params.x, params.y);
        return e;
    },
    hop: function(entity, direction) {
        if(EntityManager.hasComponent(entity, MOVEMENT)) return;
        EntityManager.addComponent(entity, MOVEMENT, { direction: direction });
    }
};