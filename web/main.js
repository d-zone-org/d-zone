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
        if(Math.random() < 0.1) {
            var actor = new Actor(x*gridSize,y*gridSize,grid.size.z);
            actor.addToGame(game);
            //actor.emit('impulse');
        }
    } else {
        grid = new HalfBlock(x*gridSize,y*gridSize,0);
    }
    grid.addToGame(game);
}

console.log('Game initialized!');

game.on('update', function (interval) {
    // Update
});

window.pause = function() { game.paused = true; };
window.unpause = function() { game.paused = false; };