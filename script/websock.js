'use strict';
// Manages the websocket connection
const { port, secure } = require('./config.js').get('socket');
const fs = require('fs');
const https = require('https');
const WSServer = require('ws').Server;
const DateFormat = require('dateformat');

module.exports = WebSock;

// TODO: Rename this to server.js and host express server for http! See docker or heroku branches for reference

function WebSock(onConnect, onJoinServer) {
    let wss;
    if(secure) {
        const server = new https.createServer({
            cert: fs.readFileSync(process.env.cert),
            key: fs.readFileSync(process.env.key)
        });
        wss = new WSServer({ server });
        server.on('error', err => console.error('Websocket server error:', err));
        server.listen(port);
    } else {
        wss = new WSServer({ port })
    }
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
            // console.log(DateFormat(new Date(), 'h:MM:ss TT'),'client disconnected, total:', wss.clients.length);
        });
    });
    wss.on('listening', () => console.log('Websocket listening on port', port));
    wss.on('error', err => console.error('Websocket server error:', err));
}

WebSock.prototype.sendData = function(data) {
    this.wss.clients.forEach(function each(client) {
        if(client.readyState !== 1) return;
        // Only send this data to client if they are connected to the data's server
        if(data.server !== client.discordServer) return;
        client.send(JSON.stringify(data));
    });
};
