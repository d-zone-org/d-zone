'use strict';
var Game = require('./script/engine/game.js');
var Renderer = require('./script/engine/renderer.js');
var Canvas = require('./script/engine/canvas.js');

var game = new Game({ step: 1000 / 60 });
game.renderer = new Renderer({ game: game, tileSize: 16 });
var canvas = new Canvas({
    id: 'main', game: game, scale: 3, backgroundColor: '#181213'
});
game.renderer.addCanvas(canvas);
game.bindCanvas(canvas);

var Tile = require('./script/environment/tile.js');
var HalfBlock = require('./script/environment/halfblock.js');
for(var tx = 0; tx < 15; tx++) for(var ty = 0; ty < 15; ty++) {
    var grid = Math.random() < 0.5 ? new Tile(tx-7,ty-7,0) : new HalfBlock(tx-7,ty-7,0);
    grid.addToGame(game);
}

console.log('Game initialized!');

game.on('update', function (interval) {
    // Update
});