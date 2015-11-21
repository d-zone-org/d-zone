'use strict';
var Preloader = require('./script/engine/preloader.js');
var Game = require('./script/engine/game.js');
var Renderer = require('./script/engine/renderer.js');
var Canvas = require('./script/engine/canvas.js');

// TODO: Loading screen while preloading images, connecting to websocket, and generating world
console.log('Loading...');
var preloader = new Preloader(initGame);

function initGame(images) {
    var game = new Game({ step: 1000 / 60 });
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
    initWebsocket(game);
    
    window.pause = function() { game.paused = true; };
    window.unpause = function() { game.paused = false; };
    window.game = game;
}

function initWebsocket(game) {
    var World = require('./script/environment/world.js');
    var Users = require('./script/actors/users.js');
    var Decorator = require('./script/props/decorator.js');
    var users, world, decorator;
    var config = JSON.parse(require('fs').readFileSync('./config.json'));
    
    console.log('Initializing websocket on port',config.server.port);
    
    // Swap the comments on the next 4 lines to switch between your websocket server and a virtual one
    
    // TODO: We don't need websocket-stream, we can use the native browser websocket api
    var WebSocket = require('websocket-stream'),
        ws = WebSocket('ws://'+config.server.address+':'+config.server.port);
    //var TestSocket = require('./script/engine/tester.js'),
    //    ws = new TestSocket(12,2000);
    //ws.write(new Buffer(JSON.stringify('im a client!')));
    ws.on('data',function(data) {
        data = JSON.parse(data);
        if(decorator) decorator.beacon.ping();
        if(data.type == 'init') { // Initial server status
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
        } {
            //console.log('Websocket data:',data);
        }
    });
    ws.on('connect', function() { console.log('Websocket connected'); });
    ws.on('disconnect', function() {console.log('Websocket disconnected'); });
    ws.on('error', function(err) { console.log('error',err); });

    ws.broadcast = function broadcast(data) {
        ws.clients.forEach(function each(client) {
            client.send(data, function(err) { console.error(err); });
        });
    };
    
    window.testMessage = function() {
        ws.emit('data',JSON.stringify({ type: 'message', data: {
            uid: users.actors[Object.keys(users.actors)[0]].uid,
            message: 'hello, test message yo', channel: '1'
        }}));
    };
}

//setTimeout(function() { game.paused = true; },1000);
