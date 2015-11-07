'use strict';
var EventEmitter = require('events').EventEmitter;
var requestAnimationFrame = require('raf');
var inherits = require('inherits');

module.exports = Renderer;
inherits(Renderer, EventEmitter);

function Renderer(game) {
    console.log('Initializing renderer');
    this.game = game;
    this.updateDrawn = false;
    
    var self = this;
    this.game.on('update', function (interval) {
        self.updateDrawn = false;
        self.interval = interval;
    });
    var draw = function() {
        if(self.updateDrawn == false) {
            if(self.canvases) {
                for(var i = 0; i < self.canvases.length; i++) {
                    self.canvases[i].draw();
                    self.emit('draw', self.canvases[i].context);
                }
            }
            self.updateDrawn = true;
        }
        requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
}

Renderer.prototype.addCanvas = function(canvas) {
    canvas.renderer = this;
    if(!this.canvases) this.canvases = [];
    this.canvases.push(canvas);
};