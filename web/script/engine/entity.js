'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var util = require('./../common/util.js');

module.exports = Entity;
inherits(Entity, EventEmitter);

function Entity() {
    
}

Entity.prototype.addToGame = function(game) {
    this.game = game;
    this.game.entities.push(this);
    if(!this.game.findEntity) this.game.findEntity = this.findEntity;
    var self = this;
    this.game.on('update', function() {
        self.emit('update');
    });
    if(this.hasOwnProperty('position')) {
        this.game.world.addToWorld(this);
        if(!this.invisible) this.game.renderer.addToZBuffer(this);
    } else {
        this.game.renderer.overlay.push(this);
    }
    this.exists = true;
};

Entity.prototype.remove = function() {
    this.exists = false;
    this.removeAllListeners('update');
    this.removeAllListeners('draw');
    
    if(this.hasOwnProperty('position')) {
        if(!this.invisible) util.findAndRemove(this, this.game.renderer.zBuffer);
        this.game.world.removeFromWorld(this);
    } else {
        util.findAndRemove(this, this.game.renderer.overlay);
    }
    this.findEntity(this, function(exists, entities, index) {
        if(exists) {
            entities.splice(index, 1);
        }
    });
};

Entity.prototype.findEntity = function(entity, callback) {
    for(var i = 0; i < this.game.entities.length; i++) {
        if(this.game.entities[i] === entity) {
            callback(true, this.game.entities, i);
        }
    }
};

Entity.prototype.tickDelay = function(cb, ticks) { // Execute callback after X ticks
    this.game.schedule.push({ type: 'once', tick: this.game.ticks+ticks, cb: cb });
};

Entity.prototype.tickRepeat = function(cb, ticks) { // Execute callback every tick for X ticks
    this.game.schedule.push({ type: 'repeat', start: this.game.ticks, count: ticks, cb: cb });
};