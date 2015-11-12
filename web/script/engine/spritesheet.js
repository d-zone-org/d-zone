'use strict';
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

module.exports = SpriteSheet;
inherits(SpriteSheet, EventEmitter);

function SpriteSheet(imgPath) {
    var image = new Image;
    var self = this;
    image.addEventListener('load', function() {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext('2d');
        context.drawImage(image,0,0,image.width,image.height,0,0,image.width,image.height);
        self.emit('loaded',canvas);
    });
    image.src = './img/'+imgPath;
}