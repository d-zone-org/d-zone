'use strict';
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var BetterCanvas = require('./../common/bettercanvas.js');

module.exports = SpriteSheet;
inherits(SpriteSheet, EventEmitter);

function SpriteSheet(imgPath) {
    var image = new Image;
    var self = this;
    image.addEventListener('load', function() {
        var canvas = new BetterCanvas(image.width,image.height);
        canvas.drawImage(image,0,0,image.width,image.height,0,0,image.width,image.height);
        self.emit('loaded',canvas.canvas);
    });
    image.src = './img/'+imgPath;
}