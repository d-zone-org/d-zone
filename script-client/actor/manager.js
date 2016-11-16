'use strict';
var EntityManager = require('man-entity');
var WorldManager = require('world/manager');
var RenderManager = require('man-render');
var actorConfig = require('./config');
var util = require('dz-util');

var ACTOR = require('./components/actor');
var SPRITE3D = require('com-sprite3d');
var TRANSFORM = require('com-transform');
var MOVEMENT = require('./components/movement');

module.exports = {
    create: function(params) {
        var data = [
            [ACTOR],
            [TRANSFORM, params], // Transform must be before sprite so render manager sees it when sprite is added
            [SPRITE3D, util.mergeObjects(actorConfig().sprites.idle.east)]
        ];
        var e = EntityManager.addEntity(data);
        WorldManager.addEntity(e);
        return e;
    },
    hop: function(entity, direction) {
        if(EntityManager.hasComponent(entity, MOVEMENT)) return;
        EntityManager.addComponent(entity, MOVEMENT, { direction: direction });
    }
};