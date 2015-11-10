'use strict';
var config = require('./config');
var Inbox = require('./script/inbox.js');

console.log('Initializing server');

var inbox = new Inbox(config);

var WebSock = require('./script/websock.js');
var webSock = new WebSock(function(socket) {
    // Send list of current online users to set up initial client state
    socket.send(JSON.stringify({ type:'init', data:inbox.getUsers() }));
});

inbox.on('test',webSock.sendData.bind(webSock));
inbox.on('presence',webSock.sendData.bind(webSock));