'use strict';
var Canvas = require('canvas');
var EventEmitter = require('events').EventEmitter;

var events = new EventEmitter();
var imageList, imagesLoaded = 0, loaded = false;

var spriteManager = {
    init(imgList) {
        imageList = imgList;
        for(var i = 0; i < imageList.length; i++) {
            var image = new Image;
            image.addEventListener('load', onImageLoad.bind(this, image, imageList[i]));
            image.src = './img/' + imageList[i] + '.png';
        }
    },
    sheets: {},
    events: events,
    waitForLoaded(cb) {
        if(spriteManager.loaded) cb();
        else events.once('loaded', cb);
    }
};

function onImageLoad(image, imageName) {
    var canvas = new Canvas(image.width, image.height);
    spriteManager.sheets[imageName] = canvas.canvas;
    canvas.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
    imagesLoaded++;
    spriteManager.loaded = imagesLoaded == imageList.length;
    if(spriteManager.loaded) events.emit('loaded');
}

module.exports = spriteManager;