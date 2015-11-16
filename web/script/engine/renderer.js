'use strict';
var EventEmitter = require('events').EventEmitter;
var requestAnimationFrame = require('raf');
var inherits = require('inherits');

module.exports = Renderer;
inherits(Renderer, EventEmitter);

function Renderer(options) {
    this.game = options.game;
    this.updateDrawn = false;
    this.zBuffer = {};
    this.zBufferKeys = [];
    this.overlay = [];
    this.frames = 0;
    
    var self = this;
    this.game.on('update', function () {
        self.updateDrawn = false;
    });
    var draw = function() {
        if(self.updateDrawn == false) {
            if(self.canvases) {
                //var timeThis = (self.game.ticks & 63) == 0;
                //if(timeThis) console.time('render');
                for(var c = 0; c < self.canvases.length; c++) {
                    self.canvases[c].draw();
                    self.emit('draw', self.canvases[c]);
                    for(var z = 0; z < self.zBufferKeys.length; z++) {
                        var zBufferDepth = self.zBuffer[self.zBufferKeys[z]];
                        for(var zz = 0; zz < zBufferDepth.length; zz++) {
                            zBufferDepth[zz].emit('draw',self.canvases[c]);
                        }
                    }
                    for(var o = 0; o < self.overlay.length; o++) {
                        self.overlay[o].emit('draw',self.canvases[c])
                    }
                }
                //if(timeThis) console.timeEnd('render');
            }
            //self.frames++;
            //if((self.game.ticks & 63) == 0) {
            //    console.log(self.frames * 60 / 64);
            //    self.frames = 0;
            //}
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

Renderer.prototype.addToZBuffer = function(obj) {
    var zDepth = obj.zDepth;
    var zBufferDepth = this.zBuffer[zDepth];
    if(zBufferDepth) {
        var added = false;
        for(var i = 0; i < zBufferDepth.length; i++) {
            if(zDepth < zBufferDepth[i].zDepth) {
                zBufferDepth.splice(i,0,obj);
                added = true;
                break;
            }
        }
        if(!added) zBufferDepth.push(obj);
    } else {
        this.zBuffer[zDepth] = [obj];
    }
    this.zBufferKeys = Object.keys(this.zBuffer);
    this.zBufferKeys.sort(function compareNumbers(a, b) { return a - b; });
};

//TODO: Optimization: Store a drawing of the base map layer that never needs sorting

Renderer.prototype.updateZBuffer = function(oldZDepth, obj) {
    var zBufferDepth = this.zBuffer[oldZDepth];
    for(var i = 0; i < zBufferDepth.length; i++) {
        if(zBufferDepth[i] == obj) {
            zBufferDepth.splice(i,1);
            break;
        }
    }
    this.addToZBuffer(obj);
};