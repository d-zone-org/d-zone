'use strict';
var BetterCanvas = require('./../common/bettercanvas.js');

module.exports = Preloader;

var imageList = ['actors','environment','static-tiles','props','font'];

function Preloader(onComplete) {
    this.images = {};
    this.imagesLoaded = 0;
    this.onComplete = onComplete;
    for(var i = 0; i < imageList.length; i++) {
        var imageName = imageList[i];
        var fileName = imageName + '.png';
        var image = new Image;
        image.addEventListener('load', this.onImageLoad.bind(this, image, imageName));
        image.src = './img/' + fileName;
    }
}

Preloader.prototype.onImageLoad = function(image, imageName) {
    var canvas = new BetterCanvas(image.width,image.height);
    this.images[imageName] = canvas.canvas;
    canvas.drawImage(image,0,0,image.width,image.height,0,0,image.width,image.height);
    this.imagesLoaded++;
    if(this.imagesLoaded == imageList.length) this.onComplete(this.images);
};