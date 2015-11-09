'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

module.exports = Tile;
inherits(Tile, WorldObject);

function Tile(x,y,z) {
    var tile = new WorldObject({position:{x:x,y:y,z:z},size:{x:16,y:16,z:1}});
    this.object = tile;
    tile.sheet = new Sheet('tile');
    tile.getSprite = function() {
        return tile.sheet.map;
    };
    tile.on('draw',function(canvas) {
        canvas.drawImageIso(tile);
    });
    return tile;
}