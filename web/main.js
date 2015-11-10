'use strict';
var Game = require('./script/engine/game.js');
var Renderer = require('./script/engine/renderer.js');
var Canvas = require('./script/engine/canvas.js');

var gridSize = 16;
var game = new Game({ step: 1000 / 60 });
game.renderer = new Renderer({ game: game });
var canvas = new Canvas({
    id: 'main', game: game, scale: 3, backgroundColor: '#181213'
});
game.renderer.addCanvas(canvas);
game.bindCanvas(canvas);

var Tile = require('./script/environment/tile.js');
var Block = require('./script/environment/block.js');
var HalfBlock = require('./script/environment/halfblock.js');
var Actor = require('./script/actors/actor.js');
//var centerBlock = new HalfBlock(0,0,0);
//centerBlock.addToGame(game);
//var mouseBlock = new HalfBlock(0,0,0);
//mouseBlock.addToGame(game);
//game.on('mousemove',function(mouseEvent) {
//    var iso = (function(x,y) { 
//        return { x: x/2 + y, y: y - x/2 };
//    })(mouseEvent.centerMouseX,mouseEvent.centerMouseY);
//    mouseBlock.position.x = iso.x;
//    mouseBlock.position.y = iso.y;
//});
var worldSize = 17;
for(var tx = 0; tx < worldSize; tx++) for(var ty = 0; ty < worldSize; ty++) {
    var x = tx-(worldSize-1)/2, y = ty-(worldSize-1)/2;
    var radius = x*x+y*y;
    if(radius > 97) continue;
    var grid;
    if(radius < 64 && Math.random() < (80 - radius)/70) {
        grid = new Tile(x*gridSize,y*gridSize,0);
        //if(Math.random() < 0.1) {
        //    var actor = new Actor(x*gridSize,y*gridSize,grid.size.z);
        //    actor.addToGame(game);
        //}
    } else {
        grid = Math.random() < (radius - 64) / 15 ? 
            new Block(x*gridSize,y*gridSize,0) : new HalfBlock(x*gridSize,y*gridSize,0);
    }
    grid.addToGame(game);
}

console.log('Game initialized!');

game.on('update', function (interval) {
    // Update
});
var config = JSON.parse(require('fs').readFileSync('./config.json'));
console.log('Initializing websocket on port',config.server.port);
var WebSocket = require('websocket-stream'),
    ws = WebSocket('ws://'+config.server.address+':'+config.server.port);
ws.write(new Buffer(JSON.stringify('im a client!')));
ws.on('data',function(data){
    data = JSON.parse(data);
    console.log('Websocket data:',data);
    
    if(data[0].status) { // If server status
        console.log('Initializing actors');
        for(var i = 0; i < data.length; i++) {
            var actor = new Actor(Math.floor(i-data.length/2)*8,0,1);
            actor.id = i;
            actor.addToGame(game);
        }
    }
});
ws.on('connect', function(){console.log('Websocket connected');});
ws.on('disconnect', function(){console.log('Websocket disconnected');});
ws.on('error', function(err){console.log('error',err);});

ws.broadcast = function broadcast(data) {
    ws.clients.forEach(function each(client) {
        client.send(data, function(err) { console.error(err); });
    });
};

window.pause = function() { game.paused = true; };
window.unpause = function() { game.paused = false; };