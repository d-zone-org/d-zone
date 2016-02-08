'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');

module.exports = Placeholder;
inherits(Placeholder, WorldObject);

function Placeholder(parentTransform,options) {
    this.parentTransform = parentTransform;
    WorldObject.call(this, {
        position: { x: options.x, y: options.y, z: options.z },
        height: 0.5
    });
    this.unWalkable = true;
    this.addToGame(this.parentTransform.actor.game);
}