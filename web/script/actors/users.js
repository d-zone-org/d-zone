'use strict';
var TextBox = require('./../common/textbox.js');

module.exports = Users;

function Users(game,world) {
    this.game = game;
    this.world = world;
    
    this.actors = {};
}

Users.prototype.addActor = function(actor) {
    var grid = this.world.randomEmptyGrid(actor);
    actor.position = {
        x: grid.x * this.world.gridSize,
        y: grid.y * this.world.gridSize,
        z: this.world.map[grid.x+':'+grid.y].size.z
    };
    this.actors[actor.uid] = actor;
    this.messageQueue = {};
};

Users.prototype.removeActor = function(actor) {
    delete this.actors[actor.uid];
    actor.remove();
};

Users.prototype.queueMessage = function(data) {
    if(!this.messageQueue[data.channel]) this.messageQueue[data.channel] = { busy: false, messages: [] };
    this.messageQueue[data.channel].messages.push({
        uid: data.uid,
        message: data.message
    });
    this.onMessageAdded(data.channel);
};

Users.prototype.onMessageAdded = function(channel) {
    if(this.messageQueue[channel].busy || this.messageQueue[channel].messages.length < 1) return;
    this.messageQueue[channel].busy = true;
    var message = this.messageQueue[channel].messages[0];
    var self = this;
    var messageBox = new TextBox(this.actors[message.uid], message.message);
    messageBox.addToGame(this.game);
    messageBox.scrollMessage(3, function() {
        self.actors[message.uid].talking = false;
        self.messageQueue[channel].messages.shift();
        self.messageQueue[channel].busy = false;
        self.onMessageAdded(channel);
    });
    this.actors[message.uid].talking = true;
};