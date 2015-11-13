'use strict';
var Game = require('./script/engine/game.js');
var Renderer = require('./script/engine/renderer.js');
var Canvas = require('./script/engine/canvas.js');

var game = new Game({ step: 1000 / 60 });
game.renderer = new Renderer({ game: game });
var canvas = new Canvas({
    id: 'main', game: game, scale: 3, backgroundColor: '#181213'
});
game.renderer.addCanvas(canvas);
game.bindCanvas(canvas);

var World = require('./script/environment/world.js');
var world = new World(game,16,17);

var Users = require('./script/actors/users.js');
var users = new Users(game,world);

console.log('Game initialized!');

game.on('update', function (interval) {
    // Update
});
var config = JSON.parse(require('fs').readFileSync('./config.json'));
console.log('Initializing websocket on port',config.server.port);

// Swap the comments on the next 4 lines to switch between your websocket server and a virtual one

var WebSocket = require('websocket-stream'),
    ws = WebSocket('ws://'+config.server.address+':'+config.server.port);
//var TestSocket = require('./script/engine/tester.js'),
//    ws = new TestSocket(12,2000);

var Actor = require('./script/actors/actor.js');
//ws.write(new Buffer(JSON.stringify('im a client!')));
ws.on('data',function(data) {
    data = JSON.parse(data);
    if(data.type == 'init') { // Initial server status
        console.log('Initializing actors',data.data);
        var actorCount = 0;
        for(var uid in data.data) { if(!data.data.hasOwnProperty(uid)) continue;
            var actor = new Actor(0,0,0);
            actor.uid = data.data[uid].user.id;
            actor.setUsername(data.data[uid].user.username,game);
            actor.setRoleColor(data.data[uid].roleColor);
            actor.updatePresence(data.data[uid].status);
            users.addActor(actor);
            actor.addToGame(game);
            actorCount++;
        }
        console.log((actorCount).toString()+' actors created');
    } else if(data.type == 'presence') { // User status update
        users.actors[data.data.uid].updatePresence(data.data.status);
    } else if(data.type == 'message') { // Chatter
        if(!data.data.message) return;
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

//setTimeout(function() { game.paused = true; },3000);

window.pause = function() { game.paused = true; };
window.unpause = function() { game.paused = false; };