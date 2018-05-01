'use strict';
var Discord = require("discord.io");
var EventEmitter = require("events").EventEmitter;
var inherits = require('inherits');
var util = require('./../web/script/common/util');

module.exports = Inbox;
inherits(Inbox, EventEmitter);

var commandCooldowns = {};

function Inbox(config) {
    EventEmitter.call(this);
    var bot = new Discord.Client({ autorun: true, token: config.get('token') });
    this.bot = bot;
    var self = this;
    function setPresence() {
        bot.setPresence({
            game: {
                name: config.get('infoCommand'),
                url: config.get('url'),
                type: 1
            }
        });
    }
    function respond(channelID, serverID) {
        if(Date.now() - (commandCooldowns[channelID] || 0) < 30 * 1000) return;
        commandCooldowns[channelID] = Date.now();
        var info = config.get('url');
        if(self.servers[serverID]) {
            info += '?s=' + self.servers[serverID].id;
            if(self.servers[serverID].password) info += '&p=' + self.servers[serverID].password;
        }
        bot.sendMessage({ to: channelID, message: info });
    }
    bot.on('ready', bot.getAllUsers);
    bot.on('allUsers', function() {
        if(self.servers) return; // Don't re-initialize if reconnecting
        console.log(new Date(), 'Logged in as: ' + bot.username + ' - (' + bot.id + ')');
        var serverList = config.get('servers');
        var serverIDs = [];
        self.servers = {};
        for(var i = 0; i < serverList.length; i++) {
            if(!bot.servers[serverList[i].id]) { // Skip unknown servers
                console.log('Unknown server ID:',serverList[i].id);
                continue;
            }
            var newServer = {
                discordID: serverList[i].id,
                name: serverList[i].alias || bot.servers[serverList[i].id].name
            };
            newServer.id = util.abbreviate(newServer.name, serverIDs);
            serverIDs.push(newServer.id);
            if(serverList[i].password) newServer.password = serverList[i].password;
            if(serverList[i].ignoreChannels) newServer.ignoreChannels = serverList[i].ignoreChannels;
            if(serverList[i].listenChannels) newServer.listenChannels = serverList[i].listenChannels;
            if(serverList[i].default) self.servers.default = newServer;
            self.servers[serverList[i].id] = newServer;
        }
        console.log('Connected to',Object.keys(self.servers).length-1, 'server(s)');
        self.emit('connected');
        setInterval(setPresence, 60 * 1000);
        setPresence();
        require('fs').writeFileSync('./bot.json', JSON.stringify(bot, null, '\t'));
        bot.on('message', function(user, userID, channelID, message, rawEvent) {
            if(userID === bot.id) return; // Don't listen to yourself, bot
            if(!bot.channels[channelID]) return respond(channelID);
            var serverID = bot.channels[channelID].guild_id;
            var channelName = bot.channels[channelID].name;
            if(!self.servers || !self.servers[serverID]) return;
            if(config.get('infoCommand') && config.get('url') && message === config.get('infoCommand')) return respond(channelID, serverID);
            if(self.servers[serverID].ignoreUsers && // Check if this user is ignored
                self.servers[serverID].ignoreUsers.indexOf(userID)) return;
            if(self.servers[serverID].ignoreChannels && // Check if this channel is ignored
                (self.servers[serverID].ignoreChannels.indexOf(channelName) >= 0 ||
                    self.servers[serverID].ignoreChannels.indexOf(channelID) >= 0)) return;
            if(self.servers[serverID].listenChannels && // Check if this channel is listened to
                self.servers[serverID].listenChannels.indexOf(channelName) < 0 &&
                self.servers[serverID].listenChannels.indexOf(channelID) < 0) return;
            var messageObject = {
                type: 'message', servers: [serverID],
                data: { uid: userID, message: bot.fixMessage(message, serverID), channel: channelID }
            };
            self.emit('message',messageObject);
        });
        bot.on('presence', function(user, userID, status, rawEvent) {
            var userInServers = [];
            for(var sKey in bot.servers) { if(!bot.servers.hasOwnProperty(sKey)) continue;
                if(bot.servers[sKey].members && bot.servers[sKey].members[userID]) userInServers.push(sKey);
            }
            var presence = {
                type: 'presence', servers: userInServers, data: { uid: userID, status: status }
            };
            self.emit('presence',presence);
        });
    });
    bot.on('disconnect', function() {
        console.log("Bot disconnected, reconnecting...");
        setTimeout(function(){
            bot.connect(); //Auto reconnect after 5 seconds
        },5000);
    });
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
        var member = discordServer.members[uid];
        users[uid] = {
            id: member.id,
            username: member.nick || member.username,
            status: member.status
        };
        users[uid].roleColor = false;
        var rolePosition = -1;
        for(var i = 0; i < discordServer.members[uid].roles.length; i++) {
            var role = discordServer.roles[discordServer.members[uid].roles[i]];
            if(!role || !role.color || role.position < rolePosition) continue;
            users[uid].roleColor = '#'+('00000'+role.color.toString(16)).substr(-6);
            rolePosition = role.position;
        }
    }
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
