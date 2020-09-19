'use strict';
// Server script entry point
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Discord = require('./script/discord.js');
const WebSock = require('./script/websock.js');

console.log('Initializing server');

let discord = new Discord();
let webSock;

discord.on('connected', () => {
    webSock = new WebSock(function onConnect(socket) {
            socket.send(JSON.stringify({ type: 'server-list', data: discord.getServers() }));
        },
        function onJoinServer(socket, connectRequest) {
            let response = discord.getUsers(connectRequest);
            if(response === 'unknown-server') {
                socket.send(JSON.stringify({
                    type: 'error', data: { message: 'Sorry, couldn\'t connect to that Discord server.' }
                }));
            } else if(response === 'bad-password') {
                socket.send(JSON.stringify({
                    type: 'error', data: { message: 'Sorry, wrong password for that Discord server.' }
                }));
                console.log('Client used wrong password to join server', connectRequest.server, connectRequest.password);
            } else {
                socket.discordServer = response.server.discordID;
                // Send list of current online users to set up initial client state
                console.log('Client joined server', response.server.name);
                socket.send(JSON.stringify({
                    type: 'server-join', data: {
                        users: response.userList, server: response.server, request: connectRequest
                    }
                }));
            }
        }
    );
    discord.on('message', webSock.sendData.bind(webSock));
    discord.on('presence', webSock.sendData.bind(webSock));
});
