'use strict';
var SpriteSheet = require('./../engine/spritesheet.js');

var map = {};
var sprite = new SpriteSheet('actors.png',map);

module.exports = Sheet;

function Sheet(newMap) {
    for(var key in newMap) { if(!newMap.hasOwnProperty(key)) continue;
        map[key] = newMap[key];
    }
    this.sprite = sprite;
    this.map = map;
}