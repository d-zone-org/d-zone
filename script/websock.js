'use strict';
var DateFormat = require('dateformat');

module.exports = WebSock;

function WebSock(config, onConnect, onJoinServer) {
    var WSServer = require('ws').Server;
    var wss = new WSServer({port:config.get('port')});
    this.wss = wss;
    wss.on('connection', function (socket) {
        console.log(DateFormat(new Date(),
            "m/d h:MM:ss TT"),'client connected to server, total:', wss.clients.length);
        
        onConnect(socket);
        
        socket.on('message', function(data) {
            data = JSON.parse(data);
            if(data.type == 'connect') { // Connection request from client
                onJoinServer(socket, data.data);
            }
        });
        socket.on('close', function(code, desc) {
            //console.log(DateFormat(new Date(),
            //    "h:MM:ss TT"),'client disconnected, total:', wss.clients.length);
        });
    });
}

WebSock.prototype.sendData = function(data) {
    this.wss.clients.forEach(function each(client) {
        if(client.readyState != 1) return;
        // Only send this data to client if they are connected to the data's server(s)
        if(data.servers.indexOf(client.discordServer) < 0) return;
        client.send(JSON.stringify(data));
    });
};