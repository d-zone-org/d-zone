'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');

module.exports = Placeholder;
inherits(Placeholder, WorldObject);

function Placeholder(parent,x,y,z) {
    this.parent = parent;
    this.invisible = true;
    WorldObject.call(this, {position:{x:x,y:y,z:z},pixelSize:{x:0,y:0,z:0}});
    this.height = 0.5;
    this.invalid = true;
    this.addToGame(this.parent.game);
    this.parent.once('movecomplete',this.destroy.bind(this));
}

Placeholder.prototype.destroy = function() {
    this.remove();
};