'use strict';
var Game = require('./script/engine/game.js');
var Renderer = require('./script/engine/renderer.js');

var game = new Game({ step: 1000 / 60 });
var renderer = new Renderer({ id: 'main', game: game, width: 'auto', scale: 3, backgroundColor: '#181213' });
game.bindCanvas(renderer);

console.log('Game initialized!');

game.on('update', function (interval) {
    // Update
});