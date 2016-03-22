'use strict';
var Canvas = require('./../common/canvas');

var spriteManager = {
    sprites: {}
};

var imageList = ['actors','environment','static-tiles','props','font'];
var imagesLoaded = 0, loaded = false;

imageList.forEach(function(imgName) {
    var image = new Image;
    image.addEventListener('load', onImageLoad.bind(this, image, imgName));
    image.src = './img/' + imgName + '.png';
});

function onImageLoad(image, imageName) {
    var canvas = new Canvas(image.width,image.height);
    spriteManager.sprites[imageName] = canvas.canvas;
    canvas.drawImage(image,0,0,image.width,image.height,0,0,image.width,image.height);
    imagesLoaded++;
    spriteManager.loaded = imagesLoaded == imageList.length;
}

module.exports = spriteManager;