'use strict';
var Discord = require("discord.io");
var EventEmitter = require("events").EventEmitter;
const util = require('util');

module.exports = Inbox;
util.inherits(Inbox, EventEmitter);

function Inbox(config) {
    var bot = new Discord({
        email: config.get('discord.email'),
        password: config.get('discord.password'),
        autorun: true
    });
    EventEmitter.call(this);
    this.bot = bot;
    var self = this;
    bot.on('message', function(user, userID, channelID, message, rawEvent) {
        var isPM = bot.servers[bot.serverFromChannel(channelID)] === undefined;
        //console.log('message received:',message);
        self.emit('test',message);
    });

    bot.on("ready", function(rawEvent) {
        console.log(new Date(),"Logged in as: "+bot.username + " - (" + bot.id + ")");
        setTimeout(function() {
            require('fs').writeFileSync('./bot.json', JSON.stringify(bot, null, '\t'));
        }, 2000);
    });
    this.msgQueue = [];
    this.sending = false;
}

Inbox.prototype.sendMessages = function(ID, messageArr, callback) {
    for(var i = 0; i < messageArr.length; i++) { // Add messages to buffer
        this.msgQueue.push({
            ID: ID, msg: messageArr[i],
            callback: i == messageArr.length-1 ? callback : false // If callback specified, only add to last message
        })
    }
    var self = this;
    function _sendMessage() {
        self.sending = true; // We're busy
        self.bot.sendMessage({
            to: self.msgQueue[0].ID,
            message: self.msgQueue[0].msg
        }, function(res) {
            var sent = self.msgQueue.shift(); // Remove message from buffer
            if(sent.callback) sent.callback(); // Activate callback if exists
            if(self.msgQueue.length < 1) { // Stop when message buffer is empty
                self.sending = false; // We're free
            } else {
                _sendMessage();
            }
        })
    }
    if(!this.sending) _sendMessage(); // If not busy with a message, send now
};