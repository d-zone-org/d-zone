'use strict';
var DateFormat = require('dateformat');

module.exports = WebSock;

function WebSock(config,onConnect) {
    var WSServer = require('ws').Server;
    var wss = new WSServer({port:config.get('server.port')});
    this.wss = wss;
    wss.on('connection', function (socket) {
        console.log(DateFormat(new Date(),
            "h:MM:ss TT"),'client connected to server, total:', wss.clients.length);
        
        onConnect(socket);
        
        socket.on('message', function(data) {
            console.log('received data:',JSON.parse(data));
        });
        socket.on('close', function(code, desc) {
            console.log(DateFormat(new Date(),
                "h:MM:ss TT"),'client disconnected, total:', wss.clients.length);
        });
    });
}

WebSock.prototype.sendData = function(data) {
    this.wss.clients.forEach(function each(client) {
        if(client.readyState != 1) return;
        client.send(JSON.stringify(data));
    });
};