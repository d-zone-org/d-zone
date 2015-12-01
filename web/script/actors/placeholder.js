'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');

module.exports = Placeholder;
inherits(Placeholder, WorldObject);

function Placeholder(parent,options) {
    this.parent = parent;
    this.invisible = true;
    WorldObject.call(this, {
        position: { x: options.x, y: options.y, z: options.z },
        pixelSize: { x: 0, y: 0, z: 0 },
        height: 0.5
    });
    this.unWalkable = true;
    this.addToGame(this.parent.game);
}