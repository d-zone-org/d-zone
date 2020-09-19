'use strict';
// Processes chat commands and modifies config
const Config = require('./config.js');
const config = Config.get('discord');
const schema = require('./../config/discord-config-schema.json');

let { command, maintainer } = config;
config.serverOptions = config.serverOptions || {};

let publicCommands = {
    // ???
};

let serverProperties = [
    {
        command: 'password',
        action: 'configure the password',
        type: 'string'
    }
    // TODO: Command to add dz-cube emoji to server
    // TODO: help command
];

const parse = ({ bot, member, author, channel, message }) => {
    console.log(config.serverOptions);
    let args = message.split(' ').filter(arg => arg !== '');
    args.shift();
    let { guild } = channel;
    let respond = responder(channel);
    let serverOptions = guild && (config.serverOptions[guild.id] || {});
    let admin = author.id === maintainer || (member && member.roles.some(roleID => {
        return guild.roles.get(roleID).permissions.has('manageGuild')
            || (serverOptions.adminRoles || []).includes(roleID);
    }));
    if(guild && serverOptions.publicCommandChannel !== channel.id && !admin) return;
    if(args.length === 0) {
        let info = config.url;
        if(guild) {
            info += '?s=' + (serverOptions.code || (serverOptions.public ? guild.id : config.serverTokens[guild.id]));
            if(serverOptions.password) info += '&p=' + serverOptions.password;
        }
        if(author.id === maintainer && (!guild || !config.serverOptions[guild.id])) {
            info += '\n' + `Use \`${command} help\` to learn how to configure D-Zone`;
        }
        respond(info);
        return;
    }
    if(args[0] === 'help') {
        message.addReaction('✅');
        return;
    }
    let serverID;
    if(/^[0-9]+$/.test(args[0])) {
        serverID = args.shift();
        if(!bot.guilds.has(serverID)) {
            respond(`D-Zone is not in server ID \`${serverID}\``);
            return;
        }
        serverOptions = config.serverOptions[serverID] || {};
        if(guild.id !== serverID && member.id !== maintainer) {
            respond(`You do not have permission to configure D-Zone on other servers`);
            return;
        }
        if(serverID === guild.id) serverID = undefined;
    }
    let serverProp = serverProperties.find(prop => prop.command === args[0].toLowerCase());
    if(serverProp) { // Server commands
        args.shift();
        if(!admin) {
            respond(`You do not have permission to ${serverProp.action} on this server`);
            return;
        }
        if(args.length === 0) {
            // Read config value
            if(serverProp.type === 'string') {
                let propValue = serverOptions[serverProp];
                let status = propValue ? `is currently set to \`${propValue}\`` : `has not been set`;
                let onServer = serverID ? 'on server ID \`${serverID}\`' : 'on this server';
                respond(`The \`${serverProp.command}\` ${status} ${onServer}
You can change it with \`${command} ${serverID ? ' ' + serverID : ''}${serverProp.command} <value>\``);
            }
            return;
        }
        if(args.length === 1) {
            // Set config value

            respond(`setting config`);
        }
    }
};

function responder(channel) {
    return message => channel.createMessage(message);
}

module.exports = {
    parse
};
