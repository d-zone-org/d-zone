'use strict';
var path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
var discordConfig = require('./discord-config');
var socketConfig = require('./socket-config');
var Inbox = require('./script/inbox.js');
var WebSock = require('./script/websock.js');

console.log('Initializing server');

var webSock = new WebSock(socketConfig,
    function onConnect(socket) {
        var data = inbox.getServers();
        if(!data) socket.send(JSON.stringify({ type: 'error', data: { message: 'The server is not ready yet, try again shortly.' } }));
        else socket.send(JSON.stringify({ type: 'server-list', data }));
    },
    function onJoinServer(socket, connectRequest) {
        var users = inbox.getUsers(connectRequest);
        if(!users) {
            socket.send(JSON.stringify({
                type: 'error', data: { message: 'The server is not ready yet, try again shortly.' }
            }));
        } else if(users === 'unknown-server') {
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

var inbox = new Inbox(discordConfig);
inbox.on('connected', () => {
    inbox.on('message', webSock.sendData.bind(webSock));
    inbox.on('presence', webSock.sendData.bind(webSock));
});
