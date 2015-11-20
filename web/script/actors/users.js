'use strict';
var TextBox = require('./../common/textbox.js');
var Actor = require('./actor.js');

module.exports = Users;

function Users(game,world) {
    this.game = game;
    this.game.users = this;
    this.world = world;
    this.actors = {};
    this.messageQueue = {};
}

Users.prototype.addActor = function(data) {
    var grid = this.world.randomEmptyGrid();
    var actor = new Actor({
        x: grid.position.x, y: grid.position.y, z: grid.position.z + grid.height, 
        uid: data.user.id,
        username: data.user.username
    });
    actor.updatePresence(data.status);
    this.actors[actor.uid] = actor;
    actor.addToGame(this.game);
    actor.setRoleColor(data.roleColor);
};

Users.prototype.removeActor = function(actor) {
    delete this.actors[actor.uid];
    actor.remove();
};

Users.prototype.queueMessage = function(data) {
    if(!data.message || !this.actors[data.uid]) return;
    if(!this.messageQueue[data.channel]) this.messageQueue[data.channel] = { busy: false, messages: [] };
    this.messageQueue[data.channel].messages.push({
        uid: data.uid,
        message: data.message
    });
    this.onMessageAdded(data.channel);
};

// TODO: If user in the middle of jumping, delay message until jump complete
Users.prototype.onMessageAdded = function(channel) {
    if(this.messageQueue[channel].busy || this.messageQueue[channel].messages.length < 1) return;
    this.messageQueue[channel].busy = true;
    var message = this.messageQueue[channel].messages[0];
    var self = this;
    var messageBox = new TextBox(this.actors[message.uid], message.message);
    messageBox.addToGame(this.game);
    this.actors[message.uid].startTalking();
    messageBox.scrollMessage(3, function() {
        self.actors[message.uid].stopTalking();
        self.messageQueue[channel].messages.shift();
        self.messageQueue[channel].busy = false;
        self.onMessageAdded(channel);
    });
};

Users.prototype.getActorAtPosition = function(x,y,z) { // For debugging
    for(var aKey in this.actors) { if(!this.actors.hasOwnProperty(aKey)) continue;
        if(this.actors[aKey].position.x == x 
            && this.actors[aKey].position.y == y 
            && this.actors[aKey].position.z == z) return this.actors[aKey];
    }
};