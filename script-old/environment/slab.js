'use strict';
var inherits = require('inherits');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');

module.exports = Slab;
inherits(Slab, WorldObject);

function Slab(style, x, y, z) {
    this.invisible = true;
    WorldObject.call(this, {position:{x:x,y:y,z:z},pixelSize:{x:16,y:16,z:1},height:0.5});
    this.style = style;
}