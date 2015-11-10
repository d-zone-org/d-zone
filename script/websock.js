'use strict';

module.exports = WebSock;

function WebSock(onConnect) {
    var WSServer = require('ws').Server;
    var wss = new WSServer({port:8970});
    this.wss = wss;
    wss.on('connection', function (socket) {
        console.log('client connected to server, total:', wss.clients.length);
        
        onConnect(socket);
        
        socket.on('message', function(data) {
            console.log('received data:',JSON.parse(data));
        });
        socket.on('close', function(code, desc) {
            console.log('client disconnected, total:', wss.clients.length);
        });
    });
}

WebSock.prototype.sendData = function(data) {
    this.wss.clients.forEach(function each(client) {
        client.send(JSON.stringify(data));
    });
};