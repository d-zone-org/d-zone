'use strict';
/*

    D-Zone Configuration Updater
    Made by JacobGunther12 (@JacobGunther12#1281)
    Rewritten by Vegeta897

    Automatically updates the discord-config.json file to
    include all servers the bot has access to

*/

require('dotenv').config();
var fs = require("fs");

var config;
try { config = require('../discord-config.json'); } catch(e) {}

if(!config) {
    console.error('Please verify that "discord-config.json" exists in the root folder and contains valid JSON data');
} else if(!process.env.token) {
    console.error('You must define the token environment variable');
} else {
    Object.assign({
        servers: []
    }, config);
    var Discord = require('discord.io');
    var bot = new Discord.Client({
        token: process.env.token,
        autorun: true
    });
    bot.on('ready', function() {
        console.log('Successfully connected to bot account.');
        var serverIDs = Object.keys(bot.servers);
        var defaultExists = false;
        var invalidServerCount = 0;
        var addedServerCount = 0;
        if(serverIDs.length > 0) {
            config.servers = config.servers.concat(serverIDs);
            config.servers = config.servers.map(function(server) {
                if(server.id) { // Existing server config
                    if(bot.servers[server.id]) {
                        console.log('Existing server in config: ' + server.id + ' ('+bot.servers[server.id].name+')');
                    } else {
                        console.error('Invalid server ID found in config:', server.id);
                        invalidServerCount++;
                    }
                    if(server.default) {
                        if(defaultExists) {
                            delete server.default; // Only one default allowed
                        } else {
                            defaultExists = true;
                        }
                    }
                    return server;
                }
                for(var i = 0; i < config.servers.length; i++) {
                    if(config.servers[i].id === server) return false;
                }
                addedServerCount++;
                console.log('Adding server to config: ' + server + ' (' + bot.servers[server].name + ')');
                return {
                    id: server
                }
            });
            console.log('---------------------------------------------------------------');
            config.servers = config.servers.filter(function(server) {
                return server;
            });
            if(!defaultExists) { // Set first server to default if none exists
                config.servers[0].default = true;
            }
            if(invalidServerCount) {
                console.error('Warning, there were ' + invalidServerCount + ' invalid server IDs in your config file!');
            }
            if(!addedServerCount) {
                console.log('No additional servers were found.');
            } else {
                console.log(addedServerCount + ' server(s) were found and added.');
            }
            try {
                fs.writeFileSync('discord-config.json', JSON.stringify(config, null, '\t'));
                console.log('Successfully wrote to file "discord-config.json".');
            } catch(e) {
                console.log('Failed to write to file "discord-config.json"!');
            }
        } else {
            console.log(bot.username + ' is not in any Discord servers.');
        }
        bot.disconnect();
    });
    bot.on('disconnect', function() {
        console.log('Disconnecting from Discord...');
    });
    bot.on('err', function(error) {
        console.log('Error connecting to bot account! ' + error);
    });
}
