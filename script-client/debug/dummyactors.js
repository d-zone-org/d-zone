'use strict';
var util = require('dz-util');
var Geometry = require('geometry');
var ActorManager = require('actor/manager');
var WorldManager = require('world/manager');

var actors = [];

module.exports = function() {
    for(var i = 0; i < 100; i++) {
        actors.push(ActorManager.create());
    }
    setInterval(function() {
        ActorManager.hop(util.pickInArray(actors), util.pickInObject(Geometry.DIRECTIONS));
    }, 30);
};