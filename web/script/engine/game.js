var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var Input = require('./input.js');
var util = require('./../common/util.js');
var now = global.performance && global.performance.now ? function() {
    return performance.now()
} : Date.now || function () {
    return +new Date()
};

module.exports = Game;
inherits(Game, EventEmitter);

function Game(options) {
    this.setMaxListeners(0);
    this.step = options.step || 1000/60;
    this.lastUpdate = 0;
    this.dt = 0;
    this.ticks = 0;

    this.input = new Input();
    this.input.on('keydown',this.keydown.bind(this));
    this.input.on('keyup',this.keyup.bind(this));
    this.mouseButtons = [];
    this.centerMouseX = -999;
    this.centerMouseY = -999;
    this.entities = [];
    this.schedule = [];
    this.mouseOver = false;

    var self = this;
    this.interval = setInterval(function() {
        if(self.crashed) return;
        var rightNow = now();
        self.dt += rightNow - self.lastUpdate;
        //if((self.ticks & 7) == 0) console.log(delta);
        if(self.lastUpdate > 0 && self.dt > 60000) {
            console.log('too many updates missed! game crash...');
            self.crashed = true; self.paused = true;
        }
        if(self.dt > self.step) {
            while(self.dt >= self.step) {
                self.dt -= self.step;
                if(self.paused) continue;
                self.ticks++;
                self.update();
            }
        }
        self.lastUpdate = now();
    }, this.step);
}

var lastUpdateTime = 0;
Game.prototype.update = function() {
    var timeThis = this.timeUpdates && (this.ticks & 255) == 0;
    if(timeThis) console.time('update');
    //if(timeThis) console.log('entities:',this.entities.length, 'actors:', Object.keys(this.users.actors).length, 'update listeners', this.listenerCount('update'), 'message listeners',this.users.listenerCount('message'));
    //if(timeThis) var updateStart = now();
    //if(timeThis) console.log('entities:', this.entities.length);
    this.emit('update');
    // TODO: Move scheduling to entity?
    for(var i = 0; i < this.schedule.length; i++) {
        var task = this.schedule[i];
        var endTick;
        if(task.type == 'repeat') {
            endTick = task.start + task.count;
            if(task.start <= this.ticks) {
                var ticks = this.ticks - task.start;
                task.cb({ ticks: ticks, percent: ticks / task.count });
            }
        } else if(task.type == 'once') {
            endTick = task.tick;
        }
        if(task.type == 'deleted' || endTick <= this.ticks) {
            if(task.type == 'once') task.cb();
            this.schedule.splice(i,1);
            i--;
        }
    }
    this.emit('render');
    if(timeThis) console.timeEnd('update');
    //if(timeThis) var thisUpdateTime = now() - updateStart;
    //if(timeThis) var updateTimeChange = thisUpdateTime-lastUpdateTime;
    //if(timeThis && updateTimeChange <= 0) console.log('%c'+updateTimeChange, 'color: #00bb00');
    //if(timeThis && updateTimeChange > 0) console.log('%c'+updateTimeChange, 'color: #ff0000');
    //if(timeThis) lastUpdateTime = thisUpdateTime;
};

Game.prototype.bindCanvas = function(canvas) {
    this.input.bindCanvas(canvas);
    this.viewWidth = canvas.width;
    this.viewHeight = canvas.height;
    this.input.on('mousemove',this.mousemove.bind(this));
    this.input.on('mousedown',this.mousedown.bind(this));
    this.input.on('mouseup',this.mouseup.bind(this));
    this.input.on('mouseout',this.mouseout.bind(this));
    this.input.on('mouseover',this.mouseover.bind(this));
    this.input.on('mousewheel',this.mousewheel.bind(this));

    this.input.on('touchmove', this.touchmove.bind(this));
    this.input.on('touchstart', this.touchstart.bind(this));
    this.input.on('touchend', this.touchend.bind(this));
    this.input.on('touchcancel', this.touchcancel.bind(this));
    canvas.on('resize',this.viewResize.bind(this));
};

Game.prototype.viewResize = function(resize) {
    this.viewWidth = resize.width;
    this.viewHeight = resize.height;
    this.input.mouseScale = resize.scale;
    this.emit('resize', resize);
};

Game.prototype.mousemove = function(mouseEvent) {
    if(this.mouseOut) return;
    //this.mouseOut = false;
    this.mouseX = mouseEvent.x;
    this.mouseY = mouseEvent.y;
    this.centerMouseX = Math.floor(mouseEvent.x - this.viewWidth / 2);
    this.centerMouseY = Math.floor(mouseEvent.y - this.viewHeight / 2);
    mouseEvent.centerMouseX = this.centerMouseX;
    mouseEvent.centerMouseY = this.centerMouseY;
    //console.log({mouseX: this.mouseX, mouseY:this.mouseY, centerMouseX:this.centerMouseX, centerMouseY:this.centerMouseY});
    this.emit('mousemove',mouseEvent);
};

Game.prototype.mousedown = function(mouseEvent) {
    if(this.mouseOver) {
        console.log(this.mouseOver);
        window.actor = this.mouseOver;
    }
    this.mouseButtons.push(mouseEvent.button);
    this.emit('mousedown',mouseEvent);
};

Game.prototype.touchend = function(mouseEvent) {
    util.findAndRemove(mouseEvent.button, this.mouseButtons);
    this.emit('touchend',mouseEvent);
};

Game.prototype.touchmove = function(mouseEvent) {
    if(this.mouseOut) return;
    this.mouseOut = false;
    this.mouseX = mouseEvent.x;
    this.mouseY = mouseEvent.y;
    this.centerMouseX = Math.floor(mouseEvent.x - this.viewWidth / 2);
    this.centerMouseY = Math.floor(mouseEvent.y - this.viewHeight / 2);
    mouseEvent.centerMouseX = this.centerMouseX;
    mouseEvent.centerMouseY = this.centerMouseY;
    this.emit('touchmove',mouseEvent);
};

Game.prototype.touchcancel = function(mouseEvent) {
    this.mouseOut = true;
    this.mouseOver = false;
    this.emit('touchcancel',mouseEvent);
};

Game.prototype.touchstart = function(mouseEvent) {
    if(this.mouseOver) {
        console.log(this.mouseOver);
        window.actor = this.mouseOver;
    }
    this.mouseButtons.push(mouseEvent.button);
    this.emit('touchstart',mouseEvent);
};

Game.prototype.mouseup = function(mouseEvent) {
    util.findAndRemove(mouseEvent.button, this.mouseButtons);
    this.emit('mouseup',mouseEvent);
};

Game.prototype.mouseout = function(mouseEvent) {
    this.mouseOut = true;
    this.mouseOver = false;
    this.emit('mouseout',mouseEvent);
};

Game.prototype.mouseover = function(mouseEvent) {
    this.mouseOut = false;
    this.emit('mouseover',mouseEvent);
};

Game.prototype.mousewheel = function(mouseEvent) {
    this.emit('mousewheel',mouseEvent);
};

Game.prototype.keydown = function(keyEvent) {
    this.emit('keydown',keyEvent);
};

Game.prototype.keyup = function(keyEvent) {
    this.emit('keyup',keyEvent);
};

Game.prototype.reset = function() {
    this.emit('destroy');
    this.removeAllListeners('update');
    this.schedule = [];
    while(this.entities.length > 0) {
        this.entities[0].remove();
    }
};
