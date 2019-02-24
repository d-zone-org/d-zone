'use strict';
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const express = require('express');
const WSServer = require('ws').Server;
const DateFormat = require('dateformat');

module.exports = WebSock;

function WebSock(config, onConnect, onJoinServer) {
    let wss;
    let server;
    const app = express();
    app.use(express.static(path.join(__dirname, './../web')));
    server = new http.createServer(app)
    wss = new WSServer({ server  })
    server.on('error', err => console.log('Websocket server error:', err));
    server.listen(config.get('port'));

    this.wss = wss;
    wss.on('connection', function(socket) {
        console.log(DateFormat(new Date(), 'm/d h:MM:ss TT'),
            `client connected to server (${wss.clients.size} total)`);
        onConnect(socket);
        socket.on('message', function(data) {
            data = JSON.parse(data);
            if(data.type === 'connect') { // Connection request from client
                onJoinServer(socket, data.data);
            }
        });
        socket.on('close', function(code, desc) {
            //console.log(DateFormat(new Date(),
            //    "h:MM:ss TT"),'client disconnected, total:', wss.clients.length);
        });
    });
    wss.on('listening', () => console.log('Websocket listening on port', config.get('port')));
    wss.on('error', err => console.log('Websocket server error:', err));
}

WebSock.prototype.sendData = function(data) {
    this.wss.clients.forEach(function each(client) {
        if(client.readyState !== 1) return;
        // Only send this data to client if they are connected to the data's server
        if(data.server !== client.discordServer) return;
        client.send(JSON.stringify(data));
    });
};
