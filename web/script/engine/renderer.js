'use strict';
var EventEmitter = require('events').EventEmitter;
var requestAnimationFrame = require('raf');
var inherits = require('inherits');
var Input = require('./input.js');

module.exports = Renderer;
inherits(Renderer, EventEmitter);

function Renderer(options) {
    console.log('Initializing renderer');
    this.id = options.id;
    this.game = options.game;
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.scale = options.scale || 1;
    this.input = new Input({ canvas: this.canvas, scale: this.scale });
    this.input.on('mousemove',this.mousemove.bind(this));
    this.input.on('mousedown',this.mousedown.bind(this));
    this.input.on('mouseup',this.mouseup.bind(this));
    if(options.width == 'auto') {
        this.onResize();
        window.addEventListener('resize',this.onResize.bind(this));
    } else {
        this.width = this.canvas.width = options.width * this.scale;
        this.height = this.canvas.height = options.height * this.scale;
    }
    if(this.scale > 1) {
        this.canvas.style.transform = 'scale(' + this.scale + ', ' + this.scale + ')';
    }
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
            // Input test
            self.context.fillStyle = self.input.mouseLeft ? '#00ff00' : self.input.mouseRight ? '#ff0000' : '#ffffff';
            if(self.input.keys['b']) self.context.fillStyle = '#0000ff';
            self.context.fillRect(self.input.mouseX,self.input.mouseY,1,1);
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

Renderer.prototype.mousemove = function(mouseEvent) {
    this.emit('mousemove',mouseEvent);
};

Renderer.prototype.mousedown = function(mouseEvent) {
    this.emit('mousedown',mouseEvent);
};

Renderer.prototype.mouseup = function(mouseEvent) {
    this.emit('mouseup',mouseEvent);
};