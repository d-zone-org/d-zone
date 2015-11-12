'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = Canvas;
inherits(Canvas, EventEmitter);

function Canvas(options) {
    this.id = options.id;
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
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
            this.canvas.style.left = options.left + 'px';
        } else if(options.hasOwnProperty('right')) {
            this.canvas.style.right = (options.right + options.width) + 'px';
        }
        if(options.hasOwnProperty('top')) {
            this.canvas.style.top = options.top + 'px';
        } else if(options.hasOwnProperty('bottom')) {
            this.canvas.style.bottom = (options.bottom + options.height) + 'px';
        }
    }
    if(this.scale > 1) {
        this.canvas.style.transform = 'scale(' + this.scale + ', ' + this.scale + ')';
    }
    this.context.mozImageSmoothingEnabled = false;
    this.context.imageSmoothingEnabled = false;
    this.backgroundColor = options.backgroundColor;
    this.canvas.addEventListener("contextmenu", function(e) {
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
    this.canvas.style.transform = 'scale(' + this.scale + ', ' + this.scale + ')';
    this.width = this.canvas.width = Math.ceil(window.innerWidth / this.scale);
    this.height = this.canvas.height = Math.ceil(window.innerHeight / this.scale);
    this.emit('resize',{ width: this.width, height: this.height })
};

Canvas.prototype.draw = function() {
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.width, this.height);
};

Canvas.prototype.drawImageIso = function(obj) {
    if(!obj.sheet) return;
    var sprite = obj.getSprite();
    if(!sprite.image) return;
    var screen = obj.toScreen();
    if(this.autosize) {
        screen.x += this.width/2;
        screen.y += this.height/2 + 8;
    }
    if(sprite.metrics.offset) {
        screen.x += sprite.metrics.offset.x;
        screen.y += sprite.metrics.offset.y;
    }
    this.context.drawImage(sprite.image,sprite.metrics.x,sprite.metrics.y,sprite.metrics.w,sprite.metrics.h,
        Math.round(screen.x),Math.round(screen.y),sprite.metrics.w,sprite.metrics.h);
};