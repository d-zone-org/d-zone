'use strict';
var util = require('dz-util');
var Geometry = require('geometry');
var ActorManager = require('actor/manager');

var actors = [];
var colors = [];
for(var c = 0; c < 10; c++) {
    colors.push(util.random(80, 255) << 16 | util.random(80, 255) << 8 | util.random(80, 255));
}

module.exports = function() {
    for(var i = 0; i < 100; i++) {
        actors.push(ActorManager.create({ color: util.pickInArray(colors) }));
    }
    setInterval(function() {
        ActorManager.hop(util.pickInArray(actors), util.pickInObject(Geometry.DIRECTIONS));
    }, 100);
    setInterval(function() {
        ActorManager.message(util.pickInArray(actors), 'Hello, this is a message!');
    }, 2000);
};