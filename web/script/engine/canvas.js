'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var BetterCanvas = require('./../common/bettercanvas.js');

module.exports = Canvas;
inherits(Canvas, EventEmitter);

function Canvas(options) {
    this.id = options.id;
    this.canvas = new BetterCanvas(0,0);
    document.body.appendChild(this.canvas.canvas);
    this.context = this.canvas.context;
    this.scale = options.scale || 1;
    this.autosize = !options.hasOwnProperty('width');
    if(this.autosize) {
        this.left = 0; this.right = 0; this.top = 0; this.bottom = 0;
        this.onResize();
        window.addEventListener('resize',this.onResize.bind(this));
    } else {
        this.width = this.canvas.width = options.width;
        this.height = this.canvas.height = options.height;
        if(options.hasOwnProperty('left')) {
            this.canvas.canvas.style.left = options.left + 'px';
        } else if(options.hasOwnProperty('right')) {
            this.canvas.canvas.style.right = (options.right + options.width) + 'px';
        }
        if(options.hasOwnProperty('top')) {
            this.canvas.canvas.style.top = options.top + 'px';
        } else if(options.hasOwnProperty('bottom')) {
            this.canvas.canvas.style.bottom = (options.bottom + options.height) + 'px';
        }
    }
    if(this.scale > 1) {
        this.canvas.canvas.style.transform = 'scale(' + this.scale + ', ' + this.scale + ')';
    }
    this.context.mozImageSmoothingEnabled = false;
    this.context.imageSmoothingEnabled = false;
    this.backgroundColor = options.backgroundColor;
    this.canvas.canvas.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });
}

Canvas.prototype.onResize = function() {
    // TODO: Scale based on world size
    if(window.innerWidth < 835 || window.innerHeight < 455) {
        this.scale = 1;
    } else if(window.innerWidth < 1255 || window.innerHeight < 680) {
        this.scale = 2;
    } else {
        this.scale = 3;
    }
    this.canvas.canvas.style.transform = 'scale(' + this.scale + ', ' + this.scale + ')';
    this.width = this.canvas.canvas.width = Math.ceil(window.innerWidth / this.scale);
    this.height = this.canvas.canvas.height = Math.ceil(window.innerHeight / this.scale);
    this.emit('resize',{ width: this.width, height: this.height })
};

Canvas.prototype.draw = function() {
    this.canvas.fill(this.backgroundColor);
};

Canvas.prototype.drawImageIso = function(obj) {
    var sprite = obj.getSprite();
    if(!sprite || !sprite.image) return;
    var screen = obj.toScreen();
    if(this.autosize) {
        screen.x += this.width/2;
        screen.y += this.height/2 + 8;
    }
    if(sprite.metrics.offset) {
        screen.x += sprite.metrics.offset.x;
        screen.y += sprite.metrics.offset.y;
    }
    if(obj.keepOnScreen) {
        screen.x = Math.min(this.width - sprite.metrics.w, Math.max(0, screen.x));
        screen.y = Math.min(this.height - sprite.metrics.h, Math.max(0, screen.y));
    }
    this.canvas.drawImage(sprite.image,sprite.metrics.x,sprite.metrics.y,sprite.metrics.w,sprite.metrics.h,
        Math.round(screen.x),Math.round(screen.y),sprite.metrics.w,sprite.metrics.h);
};