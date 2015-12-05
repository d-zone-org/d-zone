'use strict';
var Discord = require("discord.io");
var EventEmitter = require("events").EventEmitter;
const util = require('util');

module.exports = Inbox;
util.inherits(Inbox, EventEmitter);

function Inbox(config) {
    var bot = new Discord({
        email: config.get('email'),
        password: config.get('password'),
        autorun: true
    });
    EventEmitter.call(this);
    this.bot = bot;
    var self = this;
    bot.on('message', function(user, userID, channelID, message, rawEvent) {
        var serverID = bot.serverFromChannel(channelID);
        if(!self.servers[serverID]) return;
        var isPM = bot.servers[serverID] === undefined;
        if(isPM) return;
        var messageObject = { 
            type: 'message', servers: [serverID], data: { uid: userID, message: message, channel: channelID }
        };
        self.emit('message',messageObject);
    });
    bot.on('presence', function(user, userID, status, rawEvent) {
        var userInServers = [];
        for(var sKey in bot.servers) { if(!bot.servers.hasOwnProperty(sKey)) continue;
            if(bot.servers[sKey].members[userID]) userInServers.push(sKey);
        }
        var presence = { 
            type: 'presence', servers: userInServers, data: { uid: userID, status: status }
        };
        self.emit('presence',presence);
    });
    bot.on("ready", function(rawEvent) {
        console.log(new Date(),"Logged in as: "+bot.username + " - (" + bot.id + ")");
        var serverList = config.get('servers');
        self.servers = {};
        for(var i = 0; i < serverList.length; i++) {
            if(!bot.servers[serverList[i].id]) { // Skip unknown servers
                console.log('Unknown server ID:',serverList[i].id);
                continue;
            }
            self.servers[serverList[i].id] = { 
                id: serverList[i].id, name: bot.servers[serverList[i].id].name 
            };
            if(serverList[i].password) self.servers[serverList[i].id].password = serverList[i].password;
            if(serverList[i].default) self.servers.default = self.servers[serverList[i].id];
        }
        console.log('Connected to',Object.keys(self.servers).length-1, 'server(s)');
        self.emit('connected');
        require('fs').writeFileSync('./bot.json', JSON.stringify(bot, null, '\t'));
    });
    bot.on("disconnected", function() {
        console.log("Bot disconnected, reconnecting");
        // TODO: Fix error when bot reconnects
        bot.connect(); //Auto reconnect
    });
    this.msgQueue = [];
    this.sending = false;
}

Inbox.prototype.getUsers = function(connectRequest) {
    var server = this.servers[connectRequest.server];
    if(!server || !this.bot.servers[server.id]) return 'unknown-server';
    if(server.password && server.password !== connectRequest.password) return 'bad-password';
    var discordServer = this.bot.servers[server.id], users = {};
    for(var uid in discordServer.members) { if(!discordServer.members.hasOwnProperty(uid)) continue;
        users[uid] = discordServer.members[uid];
        for(var i = 0; i < discordServer.members[uid].roles.length; i++) {
            users[uid].roleColor = 
                '#'+discordServer.roles[discordServer.members[uid].roles[i]].color.toString(16);
        }
    }
    return users;
};

Inbox.prototype.getServers = function() {
    var serverList = {};
    for(var sKey in this.servers) { if(!this.servers.hasOwnProperty(sKey)) continue;
        serverList[sKey] = { id: this.servers[sKey].id, name: this.servers[sKey].name };
        if(this.servers[sKey].password) serverList[sKey].passworded = true;
    }
    return serverList;
};

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