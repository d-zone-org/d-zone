'use strict';
// Manages interfacing with Discord
const Config = require('./config.js');
const config = Config.get('discord');
const commands = require('./commands.js');
const Eris = require('eris');
const EventEmitter = require('events').EventEmitter;
const inherits = require('inherits');
const crypto = require('crypto');
const util = require('./../web/script/common/util');

module.exports = Discord;
inherits(Discord, EventEmitter);

let bot;
let init = false;
let { serverOptions } = config;

// TODO: Generate random tokens for each server if not already generated or set in config
// Token is used in the URL for private d-zone setups
// Init config.serverTokens with {} here if not set

// TODO: Disable unused WS events (options.disableEvents) https://abal.moe/Eris/docs/Client

function Discord() {
    EventEmitter.call(this);
    let { infoCommand, url } = config;
    bot = new Eris(process.env.token, { getAllUsers: true });
    let self = this;
    function setPresence() {
        bot.editStatus(null, { name: infoCommand, url, type: 0 });
    }
    bot.on('ready', () => {
        if(init) return; // Don't re-initialize if reconnecting
        console.log(new Date(), 'Bot connected: ' + bot.user.username + ' - (' + bot.user.id + ')');
        console.log(`${bot.guilds.size} server${bot.guilds.size !== 1 ? 's' : ''} online`);
        if(config.private) { // Create connection tokens for each server
            let serverTokens = config.serverTokens || {};
            for(let [id] of bot.guilds) {
                serverTokens[id] = serverTokens[id] || util.createToken(Object.values(serverTokens));
            }
            config.serverTokens = serverTokens;
            Config.write('discord', config);
            bot.on('guildCreate', guild => {
                serverTokens[guild.id] = serverTokens[guild.id] || util.createToken(Object.values(serverTokens));
                Config.write('discord', config);
            });
        }
        self.emit('connected');
        setInterval(setPresence, 60 * 1000);
        setPresence();
        bot.on('messageCreate', ({ member, author, channel, cleanContent: message }) => {
            if(!member) return commands.parse({ member, author, channel, message }); // Private message
            if(member.id === bot.user.id) return; // Don't listen to yourself, bot
            let serverID = channel.guild.id;
            if(config.command.toLowerCase() === message.split(' ')[0].toLowerCase()) {
                return commands.parse({ bot, member, author, channel, message }); // Parse & ignore commands
            }
            // if(infoCommand && url && message === infoCommand) return respond(channel);
            // Check chat filters defined in server options
            let options = serverOptions[serverID] || {};
            if(options.excludeServer) return;
            if((options.silentUsers || []).includes(member.id)) return;
            if((options.silentChannels || []).includes(channel.id)) return;
            if(options.listenChannels && !options.listenChannels.includes(channel.id)) return;
            if((options.excludeRoles || []).some(role => member.roles.includes(role))) return;
            if(options.includeRoles && (member.roles.length === 0 && options.includeRoles === 'any' ||
                !options.includeRoles.some(role => member.roles.includes(role)))) return;
            self.emit('message', {
                type: 'message', server: serverID,
                data: { uid: member.id, message, channel: channel.id }
            });
        });
        bot.on('presenceUpdate', ({ id, status, guild }) => {
            self.emit('presence', {
                type: 'presence', server: guild.id, data: { uid: id, status }
            });
        });
    });
    bot.on('disconnect', () => console.log('Bot disconnected, reconnecting...'));
    bot.on('error', err => console.error(err));
    bot.connect();
}

Discord.prototype.getUsers = function({ code, password }) {
    let serverID;
    if(config.serverTokens) { // Check connection token
        serverID = Object.keys(config.serverTokens).find(id => config.serverTokens[id] === code);
        if(config.private && !serverID) return 'unknown-server';
    }
    if(!config.private && !serverID) { // Check server ID or code
        if(bot.guilds.has(code)) serverID = code;
        else serverID = Object.keys(serverOptions).find(id => serverOptions[id].code === code);
        if(!serverID) serverID = config.defaultServer;
    }
    let guild = bot.guilds.get(serverID);
    if(!guild) return 'unknown-server'; // Server not found
    let options = serverOptions[serverID] || {};
    if(options.password && password !== options.password) return 'bad-password';
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
    let { id, name } = guild;
    return { server: { id, name }, userList: users };
};

Discord.prototype.getServers = function() {
    let serverList = {};
    for(let [id, server] of bot.guilds) {
        let serverOptions = config.serverOptions && config.serverOptions[id] || {};
        if(serverOptions.excludeServer) continue;
        serverList[id] = { id, name: serverOptions.alias || server.name };
        if(config.defaultServer === id) serverList[id].default = true;
        if(serverOptions.password) serverList[id].passworded = true;
    }
    return serverList;
};
