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
    this.backgroundColor = options.backgroundColor;
    this.scale = options.initialScale;
    this.canvases = [];
    for(var s = 1; s < 5; s++) {
        var newCanvas = new BetterCanvas(1,1);
        newCanvas.canvas.id = this.id + s;
        document.body.appendChild(newCanvas.canvas);
        newCanvas.canvas.style.transform = 'scale(' + s + ', ' + s + ')';
        newCanvas.context.mozImageSmoothingEnabled = false;
        newCanvas.context.imageSmoothingEnabled = false;
        newCanvas.canvas.addEventListener("contextmenu", function(e) {
            e.preventDefault();
        });
        this.canvases.push(newCanvas);
    }
    this.onZoom();
    this.onResize();
    window.addEventListener('resize',this.onResize.bind(this));
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

    //touch handling
    this.game.on('touchstart', function(mouseEvent) {
        if(self.game.ui.mouseOnElement) return;
        if(self.panning.buttons.length == 0) {
            self.panning.origin.x = mouseEvent.x;
            self.panning.origin.y = mouseEvent.y;
        }
        self.panning.buttons.push(mouseEvent.button);
    });

    this.game.on('touchend', function(mouseEvent) {
        util.findAndRemove(mouseEvent.button, self.panning.buttons);
    });

    this.game.on('touchmove', function(mouseEvent) {
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
        var newScale = util.clamp(self.scale + (mouseEvent.direction == 'up' ? 1 : -1), 1, 4);
        if(newScale == self.scale) return;
        self.scale = newScale;
        self.onZoom();
        self.onResize();
    });
}

Canvas.prototype.setRenderer = function(renderer) {
    this.images = renderer.images;
};

Canvas.prototype.onResize = function() {
    this.width = this.canvas.canvas.width = Math.ceil(window.innerWidth / this.scale);
    this.height = this.canvas.canvas.height = Math.ceil(window.innerHeight / this.scale);
    this.halfWidth = Math.round(this.width/2);
    this.halfHeight = Math.round(this.height/2);
    this.emit('resize',{ scale: this.scale, width: this.width, height: this.height });
};

Canvas.prototype.onZoom = function() {
    for(var s = 0; s < this.canvases.length; s++) {
        if(s+1 == this.scale) {
            this.canvases[s].canvas.style.zIndex = 5;
            this.canvas = this.canvases[s];
            this.context = this.canvas.context;
        } else {
            this.canvases[s].canvas.style.zIndex = 1;
        }
    }
};

Canvas.prototype.draw = function() {
    this.canvas.fill(this.backgroundColor);
    if(this.game.servers) return;
    this.context.fillStyle = '#d4cfb6';
    this.context.font='14px Arial';
    this.context.textAlign = 'center';
    this.context.fillText('connecting...',Math.round(this.width/2),Math.round(this.height/2-4));
};

Canvas.prototype.drawStatic = function(staticCanvas) {
    this.context.drawImage(staticCanvas, 0, 0);
};

Canvas.prototype.drawBG = function(bgCanvas) {
    var x = bgCanvas.x + this.halfWidth + this.panning.panned.x,
        y = bgCanvas.y + this.halfHeight + this.panning.panned.y;
    if(x >= this.width || y >= this.height
        || x*-1 >= bgCanvas.image.width || y*-1 >= bgCanvas.image.height) {
        return; // BG canvas is out of frame
    }
    var canvasStart = {
        x: Math.max(0,x), y: Math.max(0,y)
    };
    var canvasClipped = {
        w: Math.min(bgCanvas.image.width,this.width,this.width - x),
        h: Math.min(bgCanvas.image.height,this.height,this.height - y)
    };
    var bgStart = {
        x: Math.max(0,x*-1), y: Math.max(0,y*-1)
    };
    var bgEnd = {
        x: Math.min(bgCanvas.image.width,bgStart.x + canvasClipped.w),
        y: Math.min(bgCanvas.image.height,bgStart.y + canvasClipped.h)
    };
    var clipped = {
        x: bgEnd.x - bgStart.x, y: bgEnd.y - bgStart.y
    };
    this.context.drawImage(
        bgCanvas.image, bgStart.x, bgStart.y, clipped.x, clipped.y,
        canvasStart.x, canvasStart.y, clipped.x, clipped.y
    );
};

Canvas.prototype.drawEntity = function(sprite) {
    if(!sprite || !sprite.image || sprite.hidden) return;
    if(sprite.position && sprite.position.z > this.game.hideZ) return;
    var screen = {
        x: sprite.screen.x + this.halfWidth + this.panning.panned.x + (sprite.metrics.ox || 0),
        y: sprite.screen.y + this.halfHeight + this.panning.panned.y + (sprite.metrics.oy || 0)
    };
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
        this.context.save();
        this.context.shadowColor = 'rgba(255,255,255,1)';
        this.context.shadowBlur = 3;
    }
    if(!sprite.stay && sprite.parent && this.game.mouseOver !== sprite.parent) return;
    this.canvas.drawImage(
        image, sprite.metrics.x, sprite.metrics.y, sprite.metrics.w, sprite.metrics.h,
        Math.round(screen.x), Math.round(screen.y), sprite.metrics.w, sprite.metrics.h
    );
    if(highlight) {
        this.context.restore();
    }
    if(this.game.showGrid && sprite.grid) { // Show tile grid
        this.context.fillStyle = '#bbbbbb';
        this.context.font='9px Arial';
        this.context.fillText(sprite.grid,Math.round(screen.x)+5, Math.round(screen.y)+9);
    }
};
