'use strict';
var Game = require('./script/engine/game.js');
var Renderer = require('./script/engine/renderer.js');
var Canvas = require('./script/engine/canvas.js');

var game = new Game({ step: 1000 / 60 });
game.renderer = new Renderer(game);
var canvas = new Canvas({
    id: 'main', game: game, scale: 3, backgroundColor: '#181213'
});
game.renderer.addCanvas(canvas);
game.bindCanvas(canvas);

console.log('Game initialized!');

game.on('update', function (interval) {
    // Update
});