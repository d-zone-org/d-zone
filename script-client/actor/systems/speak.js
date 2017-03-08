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
        speechBubbles[entity] = UIManager.addBubble(sprite.dx, sprite.dy, message.message);
        message.rate = speechBubbles[entity].textSprite.meta.pages.length > 1 ? 1 : 2;
    }
    if(message.delay) return message.delay--;
    if(message.newMessage) {
        message.message = message.newMessages.shift();
        speechBubbles[entity].setText(message.message);
        message.newMessage = false;
    }
    if(message.finished) {
        UIManager.removeElement(speechBubbles[entity]);
        speechBubbles[entity] = undefined;
        ComponentManager.getComponentData(ANIMATION)[entity].stop = true;
        EntityManager.removeComponent(entity, MESSAGE);
        return;
    }
    var newChar = true;
    if(message.rate > 1) { // If not adding char on every tick
        newChar = message.tick % message.rate === 0; // Only add on first tick
    }
    if(newChar) {
        speechBubbles[entity].revealChar();
        if(speechBubbles[entity].state === 'new-page') {
            message.delay = 40;
        } else if(speechBubbles[entity].state === 'finished') {
            if(message.newMessages.length) { // More messages pending
                message.delay = 60;
                message.newMessage = true;
                message.tick = -1;
            } else { // No more messages pending
                message.delay = 90;
                message.finished = true;
            }
        }
    }
    message.tick++;
};

module.exports = speak;