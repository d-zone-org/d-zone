'use strict';
var util = require('./../common/util.js');
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var BetterCanvas = require('./../common/bettercanvas.js');

module.exports = Canvas;
inherits(Canvas, EventEmitter);

function Canvas(options) {
    this.id = options.id;
    this.game = options.game;
    this.canvas = new BetterCanvas(1,1);
    this.canvas.canvas.id = this.id;
    document.body.appendChild(this.canvas.canvas);
    this.context = this.canvas.context;
    this.scale = options.scale || 1;
    this.autosize = !options.hasOwnProperty('width');
    this.scrollZoom = 3;
    if(this.autosize) {
        this.onResize();
        window.addEventListener('resize',this.onResize.bind(this));
    } else {
        this.width = this.canvas.canvas.width = options.width;
        this.height = this.canvas.canvas.height = options.height;
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
    this.canvas.context.mozImageSmoothingEnabled = false;
    this.canvas.context.imageSmoothingEnabled = false;
    this.backgroundColor = options.backgroundColor;
    this.canvas.canvas.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });
    this.panning = {
        buttons: [],
        origin: { x: 0, y: 0 }, 
        panned: { x: 0, y: 32 }
    };
    var self = this;
    this.game.on('mousedown', function(mouseEvent) {
        if(self.game.ui.mouseOnElement) return;
        if(self.panning.buttons.length == 0) {
            self.panning.origin.x = mouseEvent.x;
            self.panning.origin.y = mouseEvent.y;
        }
        self.panning.buttons.push(mouseEvent.button);
    });
    this.game.on('mouseup', function(mouseEvent) {
        util.findAndRemove(mouseEvent.button, self.panning.buttons);
    });
    this.game.on('mousemove', function(mouseEvent) {
        var dx = mouseEvent.x - self.panning.origin.x,
            dy = mouseEvent.y - self.panning.origin.y;
        if(self.panning.buttons.length > 0) {
            self.panning.panned.x += dx;
            self.panning.panned.y += dy;
        }
        self.panning.origin.x = mouseEvent.x;
        self.panning.origin.y = mouseEvent.y;
    });
    this.game.on('mouseout', function(mouseEvent) {
        
    });
    this.game.on('mouseover', function(mouseEvent) {
        self.panning.origin.x = mouseEvent.x;
        self.panning.origin.y = mouseEvent.y;
        if(!mouseEvent.button) self.panning.buttons = [];
    });
    this.game.on('mousewheel', function(mouseEvent) {
        //self.scrollZoom = util.clamp(self.scrollZoom + (mouseEvent.direction == 'up' ? 1 : -1), 0, 6);
        //self.onResize();
    });
}

Canvas.prototype.setRenderer = function(renderer) {
    this.images = renderer.images;
};

// TODO: Create 4 different canvases to swap between when changing zoom level
// TODO: to prevent canvas occasionally flashing and blurring on chrome

Canvas.prototype.onResize = function() {
    //var oldScale = this.scale;
    //var nativeScale;
    //if(window.innerWidth < 835 || window.innerHeight < 455) {
    //    nativeScale = 1;
    //} else if(window.innerWidth < 1255 || window.innerHeight < 680) {
    //    nativeScale = 2;
    //} else {
    //    nativeScale = 3;
    //}
    this.scale = 2;/*util.clamp(nativeScale + this.scrollZoom - 3, 1,4);*/
    this.width = this.canvas.canvas.width = Math.ceil(window.innerWidth / this.scale);
    this.height = this.canvas.canvas.height = Math.ceil(window.innerHeight / this.scale);
    this.halfWidth = Math.round(this.width/2);
    this.halfHeight = Math.round(this.height/2);
    this.emit('resize',{ scale: this.scale, width: this.width, height: this.height });
    //if(this.scale == oldScale) return;
    //this.canvas.canvas.style.transform = 'scale(' + this.scale + ', ' + this.scale + ')';
};

Canvas.prototype.draw = function() {
    this.canvas.fill(this.backgroundColor);
    if(this.game.servers) return;
    this.canvas.context.fillStyle = '#bbbbbb';
    this.canvas.context.font='14px Arial';
    this.canvas.context.textAlign = 'center';
    this.canvas.context.fillText('connecting...',Math.round(this.width/2),Math.round(this.height/2-4));
};

Canvas.prototype.drawStatic = function(staticCanvas) {
    this.canvas.context.drawImage(staticCanvas, 0, 0);
};

Canvas.prototype.drawBG = function(bgCanvas) {
    var x = bgCanvas.x*-1, y = bgCanvas.y*-1;
    if(this.autosize) { x -= this.halfWidth; y -= this.halfHeight; }
    x -= this.panning.panned.x;
    y -= this.panning.panned.y;
    this.canvas.context.drawImage(
        bgCanvas.image, x, y, this.width, this.height, 
        0, 0, this.width, this.height
    );
};

Canvas.prototype.drawEntity = function(sprite) {
    if(!sprite || !sprite.image || sprite.hidden) return;
    if(sprite.position && sprite.position.z > this.game.hideZ) return;
    var screen = { x: sprite.screen.x, y: sprite.screen.y };
    if(this.autosize) { screen.x += this.halfWidth; screen.y += this.halfHeight; }
    screen.x += this.panning.panned.x;
    screen.y += this.panning.panned.y;
    screen.x += sprite.metrics.ox || 0;
    screen.y += sprite.metrics.oy || 0;
    if(sprite.keepOnScreen) {
        screen.x = Math.min(this.width - sprite.metrics.w, Math.max(0, screen.x));
        screen.y = Math.min(this.height - sprite.metrics.h, Math.max(0, screen.y));
    }
    if(screen.x >= this.width || screen.y >= this.height
        || screen.x + sprite.metrics.w <= 0 || screen.y + sprite.metrics.h <= 0) return;
    var image = sprite.image.constructor === Array ? this.images[sprite.image[0]][sprite.image[1]]
        : (this.images[sprite.image] || sprite.image);
    var highlight = sprite === this.game.mouseOver.sprite;
    if(highlight) {
        this.canvas.context.save();
        this.canvas.context.shadowColor = 'rgba(255,255,255,1)';
        this.canvas.context.shadowBlur = 3;
    }
    if(!sprite.stay && sprite.parent && this.game.mouseOver !== sprite.parent) return;
    this.canvas.drawImage(
        image, sprite.metrics.x, sprite.metrics.y, sprite.metrics.w, sprite.metrics.h,
        Math.round(screen.x), Math.round(screen.y), sprite.metrics.w, sprite.metrics.h
    );
    if(highlight) {
        this.canvas.context.restore();
    }
    if(this.game.showGrid && sprite.grid) { // Show tile grid
        this.canvas.context.fillStyle = '#bbbbbb';
        this.canvas.context.font='9px Arial';
        this.canvas.context.fillText(sprite.grid,Math.round(screen.x)+5, Math.round(screen.y)+9);
    }
};