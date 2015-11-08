'use strict';
var EventEmitter = require('events').EventEmitter;
var requestAnimationFrame = require('raf');
var inherits = require('inherits');

module.exports = Renderer;
inherits(Renderer, EventEmitter);

function Renderer(options) {
    console.log('Initializing renderer');
    this.game = options.game;
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
                for(var pivot = 0; pivot < self.zBuffer.length;) {
                    var new_pivot = false;
                    for(var i = pivot; i < self.zBuffer.length; ++i) {
                        var obj = self.zBuffer[i];
                        var parent = true;
                        for(var j = pivot; j < self.zBuffer.length; ++j) {
                            if(j == i) continue;
                            var obj2 = self.zBuffer[j];
                            if(obj2.isBehind(obj)) {
                                parent = false;
                                break;
                            }
                        }
                        if(parent) {
                            self.zBuffer[i] = self.zBuffer[pivot];
                            self.zBuffer[pivot] = obj;
                            ++pivot;
                            new_pivot = true;
                        }
                    }
                    if(!new_pivot) ++pivot;
                }
                for(var c = 0; c < self.canvases.length; c++) {
                    self.canvases[c].draw();
                    self.emit('draw', self.canvases[c]);
                    for(var z = 0; z < self.zBuffer.length; z++) {
                        self.zBuffer[z].emit('draw',self.canvases[c])
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