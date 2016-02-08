'use strict';

module.exports = transform;

function transform(actor) {
    this.actor = actor;
    this.position = this.actor.position;
    this.height = this.actor.height;
    this.move = new (require('./move.js'))(this);
}

transform.prototype.getPrecisePosition = function() {
    if(this.move.destination && this.move.moveProgress) {
        var xDelta = this.move.destination.x - this.position.x,
            yDelta = this.move.destination.y - this.position.y,
            zDelta = this.move.destination.z - this.position.z;
        xDelta *= this.move.moveProgress;
        yDelta *= this.move.moveProgress;
        zDelta *= this.move.moveProgress;
        var moveHeights = this.actor.render.sheet.map.hopping.heights;
        var moveHeightIndex = Math.floor((this.move.moveProgress-0.01)*moveHeights.length);
        return {
            x: this.position.x + xDelta,
            y: this.position.y + yDelta,
            z: this.position.z + zDelta + moveHeights[moveHeightIndex]/24
        };
    } else return this.position;
};