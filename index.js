'use strict';
var discordConfig = require('./discord-config');
var socketConfig = require('./socket-config');
var Inbox = require('./script/inbox.js');

console.log('Initializing server');

var WebSock = require('./script/websock.js');

var inbox = new Inbox(discordConfig);

var webSock;

inbox.on('connected',function() {
    webSock = new WebSock(socketConfig, 
        function onConnect(socket) {
            socket.send(JSON.stringify({ type: 'server-list', data: inbox.getServers() }));
        },
        function onJoinServer(socket, connectRequest) {
            var userList = inbox.getUsers(connectRequest);
            if(userList == 'unknown-server') {
                socket.send(JSON.stringify({
                    type: 'error', data: { message: 'Sorry, couldn\'t connect to that Discord server.' }
                }));
            } else if(userList == 'bad-password') {
                socket.send(JSON.stringify({
                    type: 'error', data: { message: 'Sorry, wrong password for that Discord server.' }
                }));
                console.log('Client used wrong password to join server',inbox.servers[connectRequest.server].name);
            } else {
                socket.discordServer = inbox.servers[connectRequest.server].id;
                // Send list of current online users to set up initial client state
                console.log('Client joined server', inbox.servers[connectRequest.server].name);
                socket.send(JSON.stringify({ type: 'server-join', data: userList }));
            }
        }
    );
    inbox.on('message',webSock.sendData.bind(webSock));
    inbox.on('presence',webSock.sendData.bind(webSock));
});