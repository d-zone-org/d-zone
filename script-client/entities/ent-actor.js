'use strict';
var util = require('dz-util');
var configLoader = require('ent-configloader');
var SPRITE3D = require('com-sprite3d');

function Actor(sprite) {
    var actorConfig = configLoader(require('cfg-actor'));
    var data = [
        [SPRITE3D, actorConfig.sprites.idle.east]
    ];
    if(sprite) util.mergeObjects(data[0][1], sprite); // Apply custom data
    return data;
}

module.exports = Actor;