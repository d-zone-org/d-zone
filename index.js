'use strict';
var path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
var discordConfig = require('./discord-config');
var socketConfig = require('./socket-config');
var Inbox = require('./script/inbox.js');

console.log('Initializing server');

var WebSock = require('./script/websock.js');

var inbox = new Inbox(discordConfig);

var webSock;

inbox.on('connected', () => {
    webSock = new WebSock(socketConfig,
        function onConnect(socket) {
            socket.send(JSON.stringify({ type: 'server-list', data: inbox.getServers() }));
        },
        function onJoinServer(socket, connectRequest) {
            var users = inbox.getUsers(connectRequest);
            if(users === 'unknown-server') {
                socket.send(JSON.stringify({
                    type: 'error', data: { message: 'Sorry, couldn\'t connect to that Discord server.' }
                }));
            } else if(users === 'bad-password') {
                socket.send(JSON.stringify({
                    type: 'error', data: { message: 'Sorry, wrong password for that Discord server.' }
                }));
                console.log('Client used wrong password to join server', connectRequest.server, connectRequest.password);
            } else {
                socket.discordServer = users.server.discordID;
                // Send list of current online users to set up initial client state
                console.log('Client joined server', users.server.name);
                socket.send(JSON.stringify({
                    type: 'server-join', data: {
                        users: users.userList, request: connectRequest
                    }
                }));
            }
        }
    );
    inbox.on('message', webSock.sendData.bind(webSock));
    inbox.on('presence', webSock.sendData.bind(webSock));
});
