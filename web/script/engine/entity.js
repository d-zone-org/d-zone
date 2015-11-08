'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = Entity;
inherits(Entity, EventEmitter);

function Entity() {
    
}

Entity.prototype.addToGame = function(game) {
    this.game = game;
    if(!this.game.entities) {
        this.game.entities = [];
    }
    this.game.entities.push(this);
    if(!this.game.findEntity) this.game.findEntity = this.findEntity;
    var self = this;
    this.game.on('update', function(interval) {
        self.emit('update', interval);
    });
    this.game.renderer.addToZBuffer(this);
    this.exists = true;
};

Entity.prototype.remove = function(){
    this.exists = false;

    this.removeAllListeners('update');
    this.removeAllListeners('draw');

    this.findEntity(this, function(exists, entities, index) {
        if(exists) {
            entities.splice(index, 1);
        }
    });
};

Entity.prototype.findEntity = function(entity, callback){
    for(var i = 0; i < this.game.entities.length; i++) {
        if(this.game.entities[i] === entity) {
            callback(true, this.game.entities, i);
        }
    }
};

Entity.prototype.nearness = function() {
    return 10000;
};