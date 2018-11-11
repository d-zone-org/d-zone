'use strict';
const Eris = require('eris');
var EventEmitter = require("events").EventEmitter;
var inherits = require('inherits');
var util = require('./../web/script/common/util');

module.exports = Inbox;
inherits(Inbox, EventEmitter);

var commandCooldowns = {};

function Inbox(config) {
    EventEmitter.call(this);
    var bot = new Eris(process.env.TOKEN, { getAllUsers: true });
    this.bot = bot;
    var self = this;
    function setPresence() {
        bot.editStatus(null, {
            name: config.get('infoCommand'),
            url: config.get('url'),
            type: 0
        });
    }
    function respond(channel) {
        if(Date.now() - (commandCooldowns[channel.id] || 0) < 30 * 1000) return;
        commandCooldowns[channel.id] = Date.now();
        let info = config.get('url');
        let server = channel.guild && self.servers[channel.guild.id];
        if(server) {
            info += '?s=' + server.id;
            if(server.password) info += '&p=' + server.password;
        }
        channel.createMessage(info);
    }
    bot.on('ready', () => {
        if(self.servers) return; // Don't re-initialize if reconnecting
        console.log(new Date(), 'Logged in as: ' + bot.user.username + ' - (' + bot.user.id + ')');
        var serverList = config.get('servers');
        var serverIDs = [];
        self.servers = new Map();
        var defaultSet = false;
        for (let guild of bot.guilds.map((x) => x)) {
            // if auto populate is turned off don't track
            if(!config.get('autoPopulate')) {
                if(!serverList.map((server) => server.id).includes(guild.id)) {
                    continue
                }
            }
            var server = serverList.find(function(server) {return guild.id == server.id});
            if(!server) server = {};

            var newServer = {};
            newServer.discordID = guild.id;
            newServer.name = server.alias || guild.name;
            if (server.default) defaultSet = true;
            newServer.default = server.default || false;
            newServer.id = util.abbreviate(newServer.name, serverIDs);
            serverIDs.push(newServer.id);
            if(server.password) newServer.password = server.password;
            if(server.ignoreChannels) newServer.ignoreChannels = server.ignoreChannels;
            if(server.listenChannels) newServer.listenChannels = server.listenChannels;
            self.servers.set(guild.id, newServer);
        }

        // define default server if default is not set
        if(!defaultSet) {
            let key = self.servers.keys().next().value;
            let value = self.servers.values().next().value;
            value.default = true;
            self.servers.set(key, value)
        }

        console.log('Connected to', self.servers.size, 'server(s)');
        self.emit('connected');
        setInterval(setPresence, 60 * 1000);
        setPresence();

        bot.on('guildCreate', (guild) => {
            var newServer = {};
            newServer.discordID = guild.id;
            newServer.name = guild.name;
            newServer.default = false;
            newServer.id = util.abbreviate(newServer.name, []);

            self.servers.set(guild.id, newServer);
            console.log("hi")
        });
        bot.on('guildDelete', (guild) => {
            self.servers.delete(guild.id);
            console.log("bye")
        });

        bot.on('messageCreate', (msg) => {
            var author = msg.author;
            var channel = msg.channel;
            var message = msg.cleanContent;
            if(author.id === bot.user.id) return; // Don't listen to yourself, bot
            if(!channel.guild) return respond(channel); // Private message
            var serverID = channel.guild.id;
            let server = self.servers.get(serverID);
            if(!server) return;
            if(config.get('infoCommand') && config.get('url') && message === config.get('infoCommand')) return respond(channel);
            if(server.ignoreUsers && // Check if this user is ignored
                server.ignoreUsers.indexOf(author.id)) return;
            if(server.ignoreChannels && // Check if this channel is ignored
                (server.ignoreChannels.indexOf(channel.name) >= 0 ||
                    server.ignoreChannels.indexOf(channel.id) >= 0)) return;
            if(server.listenChannels && // Check if this channel is listened to
                server.listenChannels.indexOf(channel.name) < 0 &&
                server.listenChannels.indexOf(channel.id) < 0) return;
            self.emit('message', {
                type: 'message', server: serverID,
                data: { uid: author.id, message, channel: channel.id }
            });
        });
        bot.on('presenceUpdate', ({ id, status, guild }) => {
            if(!self.servers.has(guild.id)) return;
            self.emit('presence', {
                type: 'presence', server: guild.id, data: { uid: id, status }
            });
        });
    });
    bot.on('disconnect', () => console.log("Bot disconnected, reconnecting..."));
    bot.on('error', err => console.log(err));
    bot.connect();
}

Inbox.prototype.getUsers = function(connectRequest) {
    let server = this.servers.get(connectRequest.server) ||
        Array.from(this.servers.values()).find(s => s.id === connectRequest.server || s.default && connectRequest.server === 'default');
    if(!server) return 'unknown-server';
    if(server.password && server.password !== connectRequest.password) return 'bad-password';
    let guild = this.bot.guilds.get(server.discordID);
    if(!guild) return 'unknown-server';
    let users = {};
    for(let [uid, member] of guild.members) {
        users[uid] = {
            id: uid,
            username: member.nick || member.username,
            status: member.status
        };
        users[uid].roleColor = false;
        let rolePosition = -1;
        for(let roleID of member.roles) {
            let role = guild.roles.get(roleID);
            if(!role || !role.color || role.position < rolePosition) continue;
            users[uid].roleColor = '#' + ('00000' + role.color.toString(16)).substr(-6);
            rolePosition = role.position;
        }
    }
    return { server, userList: users };
};

Inbox.prototype.getServers = function() {
    let serverList = {};
    for(let [sKey, server] of this.servers.entries()) {
        serverList[sKey] = { id: server.id, name: server.name };
        if(server.default) serverList[sKey].default = true;
        if(server.password) serverList[sKey].passworded = true;
    }
    return serverList;
};
