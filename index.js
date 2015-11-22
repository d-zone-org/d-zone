'use strict';
var config = require('./config');
var Inbox = require('./script/inbox.js');

console.log('Initializing server');

var WebSock = require('./script/websock.js');

var inbox = new Inbox(config);

var webSock;

inbox.on('connected',function() {
    webSock = new WebSock(config, 
        function onConnect(socket) {
            socket.send(JSON.stringify({ type: 'server-list', data: inbox.getServers() }));
        },
        function onJoinServer(socket, connectRequest) {
            var userList = inbox.getUsers(connectRequest);
            if(!userList) {
                socket.send(JSON.stringify({
                    type: 'error', data: { message: 'Sorry, couldn\'t connect to that Discord server.' } 
                }));
            }
            socket.discordServer = inbox.servers[connectRequest.server].id;
            // Send list of current online users to set up initial client state
            console.log('Client joined server', inbox.servers[connectRequest.server].name);
            socket.send(JSON.stringify({ type: 'server-join', data: userList }));
        }
    );
    inbox.on('message',webSock.sendData.bind(webSock));
    inbox.on('presence',webSock.sendData.bind(webSock));
});