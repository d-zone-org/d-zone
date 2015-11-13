'use strict';

module.exports = BetterCanvas;

function BetterCanvas(width, height) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d');
}

BetterCanvas.prototype.drawImage = function(img,sx,sy,sw,sh,dx,dy,dw,dh) {
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    if(!img || !(sx >= 0) || !(sy >= 0) || !(sw >= 1) || !(sh >= 1)
        || !isNumeric(dx) || !isNumeric(dy) || !(dw >= 1) || !(dh >= 1)) {
        console.error('bad drawImage params!',img,sx,sy,sw,sh,dx,dy,dw,dh);
    }
    this.context.drawImage(img,sx,sy,sw,sh,dx,dy,dw,dh);
};

BetterCanvas.prototype.fill = function(color) {
    this.context.fillStyle = color;
    this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
};

BetterCanvas.prototype.fillRect = function(color,x,y,w,h) {
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    if(!isNumeric(x) || !isNumeric(y) || !isNumeric(w) || !isNumeric(h)) {
        console.error('bad fillRect params!',color,x,y,w,h);
    }
    this.context.fillStyle = color;
    this.context.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
};