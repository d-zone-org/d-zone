'use strict';
var EventEmitter = require('events').EventEmitter;
var requestAnimationFrame = require('raf');
var inherits = require('inherits');

module.exports = Renderer;
inherits(Renderer, EventEmitter);

function Renderer(options) {
    console.log('Initializing renderer');
    this.game = options.game;
    this.tileSize = options.tileSize;
    this.updateDrawn = false;
    this.zBuffer = [];
    
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
                    self.emit('draw', self.canvases[i]);
                    for(var j = 0; j < self.zBuffer.length; j++) {
                        self.zBuffer[j].emit('draw',self.canvases[i])
                    }
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

Renderer.prototype.addToZBuffer = function(entity) {
    var nearness = entity.nearness();
    // If zBuffer is empty or nearness matches/exceeds highest, add it to the end
    if(this.zBuffer.length == 0 || nearness >= this.zBuffer[this.zBuffer.length-1].nearness()) { 
        this.zBuffer.push(entity);
        return;
    }
    for(var i = 0; i < this.zBuffer.length; i++) {
        if(nearness <= this.zBuffer[i].nearness()) {
            this.zBuffer.splice(i,0,entity);
            return;
        }
    }
    console.error('could not find spot in zBuffer!');
};

Renderer.prototype.updateZBuffer = function(entity) {
    var oldIndex, newIndex = this.zBuffer.length-1;
    var oldIndexFound, newIndexFound;
    var nearness = entity.nearness();
    for(var i = 0; i < this.zBuffer.length; i++) {
        var thisNearness = this.zBuffer[i].nearness();
        if(!oldIndexFound && this.zBuffer[i] === entity) {
            oldIndex = i;
            oldIndexFound = true;
            if(newIndexFound) break;
        }
        if(nearness <= thisNearness) {
            newIndex = i;
            newIndexFound = true;
            if(oldIndexFound) break;
        }
    }
    
    if(oldIndexFound) {
        if(oldIndex != newIndex) this.zBuffer.splice(newIndex, 0, this.zBuffer.splice(oldIndex,1)[0]);
    } else { // If entity not in zBuffer, add it
        this.addToZBuffer(entity);
    }
};