'use strict';

module.exports = BetterCanvas;

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function BetterCanvas(width, height) {
    if(!isNumeric(width) || !isNumeric(height)) console.error('bad canvas size!',width,height);
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d');
}

BetterCanvas.prototype.drawImage = function(img,sx,sy,sw,sh,dx,dy,dw,dh,opacity) {
    if(!img || !(sx >= 0) || !(sy >= 0) || !(sw >= 0) || !(sh >= 0)
        || !isNumeric(dx) || !isNumeric(dy) || !(dw >= 0) || !(dh >= 0)) {
        console.error('bad drawImage params!',img,sx,sy,sw,sh,dx,dy,dw,dh);
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

BetterCanvas.prototype.fill = function(color) {
    this.context.fillStyle = color;
    this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
};

BetterCanvas.prototype.clear = function() {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
};

BetterCanvas.prototype.fillRect = function(color,x,y,w,h) {
    if(!isNumeric(x) || !isNumeric(y) || !isNumeric(w) || !isNumeric(h)) {
        console.error('bad fillRect params!',color,x,y,w,h);
        window.pause();
    }
    this.context.fillStyle = color;
    this.context.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
};

BetterCanvas.prototype.clearRect = function(x,y,w,h) {
    if(!isNumeric(x) || !isNumeric(y) || !isNumeric(w) || !isNumeric(h)) {
        console.error('bad clearRect params!',x,y,w,h);
        window.pause();
    }
    this.context.clearRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
};