'use strict';
var EventEmitter = require('events').EventEmitter;
var requestAnimationFrame = require('raf');
var inherits = require('inherits');
var ColorUtil = require('./../common/colorutil.js');

module.exports = Renderer;
inherits(Renderer, EventEmitter);

function Renderer(options) {
    this.game = options.game;
    this.images = options.images;
    this.updateDrawn = false;
    this.zBuffer = {};
    this.zBufferKeys = [];
    this.overlay = [];
    this.frames = 0;
    
    var lastRenderTime = 0;
    
    var self = this;
    this.game.on('render', function () {
        self.updateDrawn = false;
    });
    var draw = function() {
        if(self.updateDrawn == false) {
            if(self.canvases) {
                var timeThis = game.timeRenders && (self.game.ticks & 511) == 0;
                if(timeThis) console.time('render');
                //if(timeThis) var renderStart = performance.now();
                for(var c = 0; c < self.canvases.length; c++) {
                    self.canvases[c].draw();
                    if(self.staticCanvas) self.canvases[c].drawStatic(self.staticCanvas);
                    //self.emit('draw', self.canvases[c]);
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
                if(timeThis) console.timeEnd('render');
                //if(timeThis) var thisRenderTime = performance.now() - renderStart;
                //if(timeThis) var renderTimeChange = thisRenderTime-lastRenderTime;
                //if(timeThis && renderTimeChange <= 0) console.log('%c'+renderTimeChange, 'color: #00bb00');
                //if(timeThis && renderTimeChange > 0) console.log('%c'+renderTimeChange, 'color: #ff0000');
                //if(timeThis) lastRenderTime = thisRenderTime;
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
    canvas.setRenderer(this);
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
    this.zBufferKeys.sort(function(a, b) { return a - b; });
};

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

Renderer.prototype.removeFromZBuffer = function(obj) {
    var zBufferDepth = this.zBuffer[obj.zDepth];
    for(var i = 0; i < zBufferDepth.length; i++) {
        if(zBufferDepth[i] == obj) {
            zBufferDepth.splice(i,1);
            break;
        }
    }
    this.zBufferKeys = Object.keys(this.zBuffer);
    this.zBufferKeys.sort(function(a, b) { return a - b; });
};

Renderer.prototype.addColorSheet = function(sheet, color) {
    if(!this.images[color]) this.images[color] = {};
    this.images[color][sheet] = ColorUtil.colorize(this.images[sheet], color, 0.75);
};