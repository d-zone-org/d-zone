'use strict';
const fs = require('fs');
const https = require('https');
const WSServer = require('ws').Server;
const DateFormat = require('dateformat');

let keyModified = false;
let certModified = false;
let reloading = false;

function WebSock(config, onConnect, onJoinServer) {
    let wss;
    if(config.get('secure')) {
        const server =  new https.createServer({
            key: fs.readFileSync(process.env.key),
            cert: fs.readFileSync(process.env.cert)
        });
        this.server = server
        wss = new WSServer({ server });
        server.on('error', err => console.log('Websocket server error:', err));
        server.listen(config.get('port'));

        fs.watch(process.env.key, { persistent: false }, () => {
            keyModified = true;
            if(certModified && !reloading) this.reloadCerts();
        });
        fs.watch(process.env.cert, { persistent: false }, () => {
            certModified = true;
            if(keyModified && !reloading) this.reloadCerts();
        });
    } else {
        wss = new WSServer({ port: config.get('port') })
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

// https://github.com/nodejs/node/issues/15115#issuecomment-709389849
WebSock.prototype.reloadCerts = async function() {
    reloading = true;
    //keep trying until success
    while(true) {
        try {
            //sometimes throws an error if certs haven't finished writing to disk
            this.server.setSecureContext({
                key: fs.readFileSync(process.env.key),
                cert: fs.readFileSync(process.env.cert)
            });
            keyModified = certModified = reloading = false;
            console.log('Certificates reloaded');
            break;
        }
        catch(swallow) {}
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}

module.exports = WebSock;
