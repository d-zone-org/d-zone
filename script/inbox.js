'use strict';
var Discord = require("discord.io");
var EventEmitter = require("events").EventEmitter;
var inherits = require('inherits');
var util = require('./../web/script-old/common/util');

module.exports = Inbox;
inherits(Inbox, EventEmitter);

function Inbox(config) {
    var bot = new Discord({
        email: config.get('email'),
        password: config.get('password'),
        autorun: true
    });
    EventEmitter.call(this);
    this.bot = bot;
    var self = this;
    bot.on('ready', function(rawEvent) {
        if(self.servers) return; // Don't re-initialize if reconnecting
        console.log(new Date(),"Logged in as: "+bot.username + " - (" + bot.id + ")");
        var serverList = config.get('servers');
        var serverIDs = [];
        self.servers = {};
        for(var i = 0; i < serverList.length; i++) {
            if(!bot.servers[serverList[i].id]) { // Skip unknown servers
                console.log('Unknown server ID:',serverList[i].id);
                continue;
            }
            var newServer = { discordID: serverList[i].id, name: bot.servers[serverList[i].id].name };
            newServer.id = util.abbreviate(newServer.name, serverIDs);
            serverIDs.push(newServer.id);
            if(serverList[i].password) newServer.password = serverList[i].password;
            if(serverList[i].ignoreChannels) newServer.ignoreChannels = serverList[i].ignoreChannels;
            if(serverList[i].default) self.servers.default = newServer;
            self.servers[serverList[i].id] = newServer;
        }
        console.log('Connected to',Object.keys(self.servers).length-1, 'server(s)');
        self.emit('connected');
        require('fs').writeFileSync('./bot.json', JSON.stringify(bot, null, '\t'));
    });
    bot.on('message', function(user, userID, channelID, message, rawEvent) {
        var serverID = bot.serverFromChannel(channelID);
        if(!self.servers[serverID]) return;
        var isPM = bot.servers[serverID] === undefined;
        if(isPM) return;
        var channelName = bot.servers[serverID].channels[channelID].name;
        if(self.servers[serverID].ignoreChannels // Check if this channel is ignored
            && self.servers[serverID].ignoreChannels.indexOf(channelName) >= 0) return;
        var messageObject = { 
            type: 'message', servers: [serverID], 
            data: { uid: userID, message: bot.fixMessage(message), channel: channelID }
        };
        self.emit('message',messageObject);
    });
    bot.on('presence', function(user, userID, status, gameName, rawEvent) {
        var userInServers = [];
        for(var sKey in bot.servers) { if(!bot.servers.hasOwnProperty(sKey)) continue;
            if(bot.servers[sKey].members[userID]) userInServers.push(sKey);
        }
        var presence = { 
            type: 'presence', servers: userInServers, data: { uid: userID, status: status }
        };
        self.emit('presence',presence);
    });
    bot.on("disconnected", function() {
        console.log("Bot disconnected, reconnecting...");
        setTimeout(function(){
            bot.connect(); //Auto reconnect after 3 seconds
        },3000);
    });
    this.msgQueue = [];
    this.sending = false;
}

Inbox.prototype.getUsers = function(connectRequest) {
    var server = this.servers[connectRequest.server];
    if(!server) { // If requested server ID is not a Discord ID, check abbreviated IDs
        for(var sKey in this.servers) { if(!this.servers.hasOwnProperty(sKey)) continue;
            if(this.servers[sKey].id == connectRequest.server) {
                server = this.servers[sKey];
                break;
            }
        }
    }
    if(!server) return 'unknown-server';
    if(server.password && server.password !== connectRequest.password) return 'bad-password';
    var discordServer = this.bot.servers[server.discordID], users = {};
    for(var uid in discordServer.members) { if(!discordServer.members.hasOwnProperty(uid)) continue;
        users[uid] = discordServer.members[uid];
        users[uid].roleColor = false;
        var rolePosition = -1;
        for(var i = 0; i < discordServer.members[uid].roles.length; i++) {
            var role = discordServer.roles[discordServer.members[uid].roles[i]];
            if(!role || !role.color || role.position <= rolePosition) continue;
            users[uid].roleColor = '#'+role.color.toString(16);
            rolePosition = role.position;
        }
    }
    // TODO: Don't send the entire user object! Just the properties needed
    return { server: server, userList: users };
};

Inbox.prototype.getServers = function() {
    var serverList = {};
    for(var sKey in this.servers) { if(!this.servers.hasOwnProperty(sKey)) continue;
        var key = sKey == 'default' ? sKey : this.servers[sKey].id;
        serverList[key] = { id: this.servers[sKey].id, name: this.servers[sKey].name };
        if(this.servers[sKey].password) serverList[key].passworded = true;
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