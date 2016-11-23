'use strict';
var util = require('dz-util');
var ActorManager = require('actor/manager');
var WorldManager = require('world/manager');

var actors = [];

module.exports = function() {
    for(var i = 0; i < 30; i++) {
        actors.push(ActorManager.create());
    }
};