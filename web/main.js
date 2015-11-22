'use strict';
var Preloader = require('./script/engine/preloader.js');
var Game = require('./script/engine/game.js');
var Renderer = require('./script/engine/renderer.js');
var Canvas = require('./script/engine/canvas.js');
var bs = require('browser-storage');

// TODO: Loading screen while preloading images, connecting to websocket, and generating world
console.log('Loading...');
var preloader = new Preloader(initGame);
var game, ws;

function initGame(images) {
    game = new Game({ step: 1000 / 60 });
    game.renderer = new Renderer({ game: game, images: images });
    var canvas = new Canvas({
        id: 'main', game: game, scale: 3, backgroundColor: '#181213'
    });
    game.renderer.addCanvas(canvas);
    game.bindCanvas(canvas);
    //game.showGrid = true;
    //game.timeRenders = true;
    
    //game.on('update', function () {
    //    // Update
    //});
    initWebsocket();
    
    window.pause = function() { game.paused = true; };
    window.unpause = function() { game.paused = false; };
    window.game = game;
}

function initWebsocket() {
    var World = require('./script/environment/world.js');
    var Users = require('./script/actors/users.js');
    var Decorator = require('./script/props/decorator.js');
    var users, world, decorator;
    var config = JSON.parse(require('fs').readFileSync('./config.json'));
    
    console.log('Initializing websocket on port',config.server.port);
    
    // Swap the comments on the next 4 lines to switch between your websocket server and a virtual one
    // NOTE: Virtual server currently incompatible with new format, pester me to update it
    
    // TODO: We don't need websocket-stream, we can use the native browser websocket api
    var WebSocket = require('websocket-stream');
    ws = WebSocket('ws://'+config.server.address+':'+config.server.port);
    //var TestSocket = require('./script/engine/tester.js'),
    //    ws = new TestSocket(12,2000);
    ws.on('data',function(data) {
        data = JSON.parse(data);
        if(decorator) decorator.beacon.ping();
        if(data.type == 'server-list') {
            game.servers = data.data;
            console.log('Got server list:',game.servers);
            var defaultServer = bs.getItem('dzone-default-server'); // Look for saved discord server info
            if(defaultServer) defaultServer = JSON.parse(defaultServer);
            if(!defaultServer || !game.servers[defaultServer.id]) defaultServer = { id: 'default' };
            joinServer(defaultServer);
        } else if(data.type == 'server-join') { // Initial server status
            game.reset();
            world = new World(game, Math.round(3 * Math.sqrt(Object.keys(data.data).length)));
            decorator = new Decorator(game, world);
            users = new Users(game, world);
            //return;
            console.log('Initializing actors',data.data);
            for(var uid in data.data) { if(!data.data.hasOwnProperty(uid)) continue;
                //if(data.data[uid].status != 'online') continue;
                if(!data.data[uid].user.username) continue;
                users.addActor(data.data[uid]);
                //break;
            }
            console.log((Object.keys(users.actors).length).toString()+' actors created');
            game.renderer.canvases[0].onResize();
        } else if(data.type == 'presence') { // User status update
            if(!users.actors[data.data.uid]) return;
            users.actors[data.data.uid].updatePresence(data.data.status);
        } else if(data.type == 'message') { // Chatter
            users.queueMessage(data.data);
        } else if(data.type == 'error') {
            window.alert(data.data.message);
        } else {
            //console.log('Websocket data:',data);
        }
    });
    ws.on('connect', function() { console.log('Websocket connected'); });
    ws.on('disconnect', function() {console.log('Websocket disconnected'); });
    ws.on('error', function(err) { console.log('error',err); });
    
    window.testMessage = function() {
        ws.emit('data',JSON.stringify({ type: 'message', data: {
            uid: users.actors[Object.keys(users.actors)[0]].uid,
            message: 'hello, test message yo', channel: '1'
        }}));
    };
}

function joinServer(server) {
    var connectionMessage = { type: 'connect', data: { server: server.id } };
    if(server.password) connectionMessage.data.password = server.password;
    console.log('Requesting to join server', game.servers[server.id].name);
    ws.write(new Buffer(JSON.stringify(connectionMessage)));
}

window.setDefaultServer = function(serverID) {
    bs.setItem('dzone-default-server',JSON.stringify({ id: serverID }));
};

window.joinServer = joinServer;

//setTimeout(function() { game.paused = true; },1000);