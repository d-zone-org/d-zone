'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var util = require('./../common/util.js');

module.exports = Entity;
inherits(Entity, EventEmitter);

function Entity() {
    this.sprite = {};
}

Entity.prototype.addToGame = function(game) {
    this.game = game;
    this.game.entities.push(this);
    if(this.hasOwnProperty('position')) {
        this.game.world.addToWorld(this);
        if(!this.invisible) this.game.renderer.addToZBuffer(this.sprite, this.zDepth);
    } else {
        this.game.renderer.overlay.push(this.sprite);
    }
    this.exists = true;
};

Entity.prototype.remove = function() {
    this.exists = false;
    if(this.hasOwnProperty('position')) {
        if(!this.invisible) this.game.renderer.removeFromZBuffer(this, this.zDepth);
        this.game.world.removeFromWorld(this);
    } else {
        util.findAndRemove(this, this.game.renderer.overlay);
    }
    util.findAndRemove(this, this.game.entities);
};

Entity.prototype.tickDelay = function(cb, ticks) { // Execute callback after X ticks
    this.game.schedule.push({ type: 'once', tick: this.game.ticks+ticks, cb: cb, entity: this });
};

Entity.prototype.tickRepeat = function(cb, ticks) { // Execute callback every tick for X ticks
    this.game.schedule.push({ type: 'repeat', start: this.game.ticks, count: ticks, cb: cb, entity: this });
};

Entity.prototype.removeFromSchedule = function(cb) {
    for(var i = 0; i < this.game.schedule.length; i++) {
        if(this.game.schedule[i].entity === this && this.game.schedule[i].cb === cb) {
            this.game.schedule[i].type = 'deleted';
            break;
        }
    }
};