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
    for(var i = 0; i < 200; i++) {
        actors.push(ActorManager.create({ color: util.pickInArray(colors) }));
    }
    setInterval(function() {
        ActorManager.hop(util.pickInArray(actors), util.pickInObject(Geometry.DIRECTIONS));
    }, 50);
    setInterval(function() {
        ActorManager.message(util.pickInArray(actors), 'Hey, this is a long message! Wow, it sure takes up more than 4 lines! So, some pagination is required. Here we go, 1 2 3 4 paginate! Yeah, we did it!');
    }, 4000);
};