'use strict';
var System = require('system');
var EntityManager = require('man-entity');
var ComponentManager = require('man-component');
var UIManager = require('ui/manager');
var ActorManager = require('actor/manager');
var actorConfig = require('../config');

var MESSAGE = require('../components/message');
var ANIMATION = require('com-animation');

var speak = new System([
    require('../components/actor'),
    require('com-sprite3d'),
    MESSAGE
]);

var speechBubbles = [];

speak.updateEntity = function(entity, actor, sprite, message) {
    if(!message.init) {
        if(EntityManager.hasComponent(entity, ANIMATION)) return;
        message.init = true;
        message.tick = 0;
        if(actor.facing === 'north') ActorManager.turn(entity, 'east');
        if(actor.facing === 'west') ActorManager.turn(entity, 'south');
        EntityManager.addComponent(entity, ANIMATION, actorConfig().animations.speak[actor.facing]);
        // speechBubbles[entity] = UIManager.addBubble(0, sprite.dx, sprite.dy, message.message);
    }
    var newChar = true;
    if(message.rate > 1) { // If not adding char on every tick
        newChar = message.tick % message.rate === 0; // Only add on first tick
    }
    if(newChar) {
        message.charIndex = Math.floor(message.tick / message.rate);
        if(message.charIndex < message.message.length) {
            // New char
        } else {
            // UIManager.removeElement(speechBubbles[entity]);
            // speechBubbles[entity] = undefined;
            ComponentManager.getComponentData(ANIMATION)[entity].stop = true;
            EntityManager.removeComponent(entity, MESSAGE);
        }
    }
    message.tick++;
};

module.exports = speak;