'use strict';

module.exports = Physics;

function Physics(actor) {
    this.actor = actor;
    this.position = this.actor.position;
}

Physics.prototype.getPrecisePosition = function() {
    if(this.actor.move.destination && this.actor.move.moveProgress) {
        var xDelta = this.actor.move.destination.x - this.position.x,
            yDelta = this.actor.move.destination.y - this.position.y,
            zDelta = this.actor.move.destination.z - this.position.z;
        xDelta *= this.actor.move.moveProgress;
        yDelta *= this.actor.move.moveProgress;
        zDelta *= this.actor.move.moveProgress;
        var moveHeights = this.actor.render.sheet.map.hopping.heights;
        var moveHeightIndex = Math.floor((this.actor.move.moveProgress-0.01)*moveHeights.length);
        return {
            x: this.position.x + xDelta,
            y: this.position.y + yDelta,
            z: this.position.z + zDelta + moveHeights[moveHeightIndex]/24
        };
    } else return this.position;
};