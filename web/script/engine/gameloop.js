var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var now = global.performance && global.performance.now ? function() {
    return performance.now()
} : Date.now || function () {
    return +new Date()
};

module.exports = Game;
inherits(Game, EventEmitter);

function Game(options) {
    this.step = options.step || 1000/60;
    //this.canvas = document.getElementById(options.canvasId);
    //this.context = this.canvas.getContext('2d');
    //this.width = this.canvas.width = options.width;
    //this.height = this.canvas.height = options.height;
    //this.backgroundColor = options.backgroundColor;
    this.lastUpdate = 0;
    this.dt = 0;
    this.ticks = 0;

    var self = this;
    this.interval = setInterval(function(){
        if(self.crashed) return;
        self.dt += now() - self.lastUpdate;
        if(self.dt > 60000) {
            console.log('too many updates missed! game crash');
            self.crashed = true; self.paused = true;
        }
        if(self.dt > self.step) {
            while(self.dt >= self.step) {
                self.dt -= self.step; if(self.paused) { continue; } else { self.rendered = false; }
                self.ticks++; self.update();
            }
        }
        self.lastUpdate = now();
    },this.step);
}

Game.prototype.update = function() {
    this.emit('update',this.dt);
};