'use strict';
var util = require('dz-util');
var actorConfig = require('actor-cfg');

function Actor(sprite) {
    var data = [
        [require('com-sprite3d'), actorConfig().sprites.idle.east]
    ];
    if(sprite) util.mergeObjects(data[0][1], sprite); // Apply custom data
    return data;
}

module.exports = Actor;