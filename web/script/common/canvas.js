'use strict';

module.exports = Canvas;

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function Canvas(width, height) {
    console.assert(isNumeric(width) && isNumeric(height),'Bad canvas params!',width,height);
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.setSize(width,height);
}

Canvas.prototype.setSize = function(w,h) {
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
};

Canvas.prototype.drawImage = function(img, sx, sy, sw, sh, dx, dy, dw, dh, opacity) {
    console.assert(img && sx >= 0 && sy >= 0 && sw >= 0 && sh >= 0
        && isNumeric(dx) && isNumeric(dy) && dw >= 0 && dh >= 0,
        'Bad drawImage params!',img,sx,sy,sw,sh,dx,dy,dw,dh);
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
    console.assert(isNumeric(x) && isNumeric(y) && isNumeric(w) && isNumeric(h),
        'Bad fillRect params!',color,x,y,w,h);
    this.context.fillStyle = color;
    this.context.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
};

Canvas.prototype.clearRect = function(x, y, w, h) {
    console.assert(isNumeric(x) && isNumeric(y) && isNumeric(w) && isNumeric(h),
        'Bad clearRect params!',color,x,y,w,h);
    this.context.clearRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
};