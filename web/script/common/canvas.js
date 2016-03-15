'use strict';

module.exports = Canvas;

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function Canvas(width, height) {
    if(!isNumeric(width) || !isNumeric(height)) console.error('Bad canvas size!',width,height);
    this.width = width;
    this.height = height;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d');
}

Canvas.prototype.drawImage = function(img, sx, sy, sw, sh, dx, dy, dw, dh, opacity) {
    if(!img || !(sx >= 0) || !(sy >= 0) || !(sw >= 0) || !(sh >= 0)
        || !isNumeric(dx) || !isNumeric(dy) || !(dw >= 0) || !(dh >= 0)) {
        console.error('Bad drawImage params!',img,sx,sy,sw,sh,dx,dy,dw,dh);
        window.pause();
    }
    if(opacity) {
        this.context.save();
        this.context.globalAlpha = opacity;
    }
    this.context.drawImage(img,sx,sy,sw,sh,dx,dy,dw,dh);
    if(opacity) {
        this.context.restore();
    }
};

Canvas.prototype.fill = function(color) {
    this.context.fillStyle = color;
    this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
};

Canvas.prototype.clear = function() {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
};

Canvas.prototype.fillRect = function(color, x, y, w, h) {
    if(!isNumeric(x) || !isNumeric(y) || !isNumeric(w) || !isNumeric(h)) {
        console.error('Bad fillRect params!',color,x,y,w,h);
        window.pause();
    }
    this.context.fillStyle = color;
    this.context.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
};

Canvas.prototype.clearRect = function(x, y, w, h) {
    if(!isNumeric(x) || !isNumeric(y) || !isNumeric(w) || !isNumeric(h)) {
        console.error('Bad clearRect params!',x,y,w,h);
        window.pause();
    }
    this.context.clearRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
};