'use strict';
var Game = require('./script/engine/gameloop.js');

var game = new Game({step:1000/60});

game.on('update', function(interval){
    // Update
});