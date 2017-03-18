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
        ActorManager.message(util.pickInArray(actors), sentenceBuilder());
    }, 2000);
};

var nonsense = ['lol','omg','discord','haha','...','yeah','no','wow','indeed','right','memes'];
function sentenceBuilder() {
    var sentence = '';
    var wordCount = util.random(1, 30);
    for(var i = 0; i < wordCount; i++) {
        sentence += (i == 0 ? '' : ' ') + util.pickInArray(nonsense);
    }
    return sentence;
}