'use strict';

module.exports = SpriteSheet;

function SpriteSheet(imgPath,map) {
    this.map = map;
    this.img = new Image;
    var self = this;
    this.img.addEventListener('load', function() {
        self.loaded = true;
    });
    this.img.src = './img/'+imgPath;
}