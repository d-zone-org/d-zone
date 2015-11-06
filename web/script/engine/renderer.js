'use strict';
var EventEmitter = require('events').EventEmitter;
var requestAnimationFrame = require('raf');
var inherits = require('inherits');

module.exports = Renderer;
inherits(Renderer, EventEmitter);

function Renderer(options) {
    this.id = options.id;
    this.game = options.game;
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    console.log('creating canvas!',window.innerWidth,window.innerHeight);
    this.context = this.canvas.getContext('2d');
    this.scale = options.scale || 1;
    if(options.width == 'auto') {
        this.onResize();
        window.addEventListener('resize',this.onResize.bind(this));
    } else {
        this.width = this.canvas.width = options.width * this.scale;
        this.height = this.canvas.height = options.height * this.scale;
    }
    if(this.scale > 1) {
        this.canvas.style.transformOrigin = '0 0';
        this.canvas.style.transform = 'scale(' + this.scale + ', ' + this.scale + ')';
    }
    this.canvas.style.imageRendering = 'pixelated';
    this.context.mozImageSmoothingEnabled = false;
    this.context.imageSmoothingEnabled = false;
    this.backgroundColor = options.backgroundColor;
    this.updateDrawn = false;
    
    var self = this;
    this.game.on('update', function (interval) {
        self.updateDrawn = false;
        self.interval = interval;
    });
    var draw = function() {
        if(self.updateDrawn == false) {
            self.context.fillStyle = self.backgroundColor;
            self.context.fillRect(0, 0, self.width, self.height);
            self.emit('draw', self.context);
            self.updateDrawn = true;
        }
        requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
}

Renderer.prototype.onResize = function() {
    this.width = this.canvas.width = Math.ceil(window.innerWidth / this.scale);
    this.height = this.canvas.height = Math.ceil(window.innerHeight / this.scale);
};