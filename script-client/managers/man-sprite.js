'use strict';
var Canvas = require('canvas');
var TextureManager = require('man-texture');
var EventEmitter = require('events').EventEmitter;

var sheets = {};
var events = new EventEmitter();
events.setMaxListeners(0);
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
    waitForLoaded(cb) {
        if(spriteManager.loaded) cb();
        else events.once('loaded', cb);
    },
    getColorSheet,
    sheets,
    events
};

function onImageLoad(image, imageName) {
    var canvas = new Canvas(image.width, image.height);
    sheets[imageName] = canvas.canvas;
    canvas.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
    imagesLoaded++;
    spriteManager.loaded = imagesLoaded == imageList.length;
    if(spriteManager.loaded) events.emit('loaded');
}

function getColorSheet(sheet, color, alpha, regions) {
    var hex = '#' + ('00000' + color.toString(16)).substr(-6);
    var sheetName = sheet + hex;
    this.waitForLoaded(function() {
        if(!sheets[sheetName]) {
            regions = regions || [];
            var canvas = document.createElement('canvas');
            canvas.width = sheets[sheet].width;
            canvas.height = sheets[sheet].height;
            var context = canvas.getContext('2d');
            context.drawImage(sheets[sheet], 0, 0);
            context.globalCompositeOperation = 'color';
            var colorCanvas = document.createElement('canvas');
            colorCanvas.width = canvas.width;
            colorCanvas.height = canvas.height;
            var colorContext = colorCanvas.getContext('2d');
            colorContext.fillStyle = hex;
            colorContext.globalAlpha = alpha;
            colorContext.fillRect(0, 0, canvas.width, canvas.height);
            for(var i = 0; i < regions.length; i++) {
                var region = regions[i];
                colorContext.clearRect(region.x, region.y, region.w, region.h);
                colorContext.fillStyle = region.color ? region.color : hex;
                colorContext.globalAlpha = region.alpha ? region.alpha : alpha;
                colorContext.fillRect(region.x, region.y, region.w, region.h);
            }
            context.drawImage(colorCanvas, 0, 0);
            applyAlpha(sheets[sheet], canvas); // Restore original alpha channel
            sheets[sheetName] = canvas;
        }
    });
    return sheetName;
}

function applyAlpha(source, target) { // Overwrite target's alpha map with source's
    var sourceData = source.getContext('2d').getImageData(0, 0, source.width, source.height),
        targetCtx = target.getContext('2d'),
        targetData = targetCtx.getImageData(0,0, target.width, target.height);
    for(var p = 3; p < targetData.data.length; p += 4) {
        targetData.data[p] = sourceData.data[p];
    }
    targetCtx.putImageData(targetData, 0, 0);
}

module.exports = spriteManager;