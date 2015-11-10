'use strict';
var config = require('./config');
var Inbox = require('./script/inbox.js');

console.log('Initializing server');

var inbox = new Inbox(config);

var WebSock = require('./script/websock.js');
var webSock = new WebSock(function(socket) {
    // Send current server status to set up initial client state
    socket.send(JSON.stringify(inbox.bot.servers[config.get('discord.serverID')].presences));
});

inbox.on('test',webSock.sendData.bind(webSock));