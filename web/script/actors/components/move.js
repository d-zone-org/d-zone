'use strict';
var Placeholder = require('./../placeholder.js');

module.exports = Move;

function Move(transform) {
    this.transform = transform;
    this.destination = false;
    this.moveProgress = 0;
}

Move.prototype.tryMove = function(x,y) {
    var xDelta = x - this.transform.position.x,
        yDelta = y - this.transform.position.y;
    if(xDelta == 0 && yDelta == 0) return;
    this.transform.actor.facing = xDelta < 0 ? 'west' : xDelta > 0 ? 'east' : yDelta < 0 ? 'north' : 'south';
    this.transform.actor.render.updateSprite();
    if(this.transform.actor.underneath()) {
        //console.log('actor: object on top');
        this.transform.actor.emit('get-off-me');
        return; // Can't move with object on top
    }
    var walkable = this.transform.actor.game.world.walkable[x+':'+y];
    if(walkable >= 0 && Math.abs(this.transform.position.z - walkable) <= 0.5) {
        //console.log('actor: destination walkable at height',walkable);
        return { x: x, y: y, z: walkable };
    }
};

Move.prototype.moveTo = function(x,y,z) {
    var deltaX = x - this.transform.position.x,
        deltaY = y - this.transform.position.y,
        deltaZ = z - this.transform.position.z;
    if(deltaX == 0 && deltaY == 0 && deltaZ == 0) return;
    //console.log('actor: moving to',newX,newY,newZ);
    this.transform.actor.game.world.moveObject(this.transform.actor,x,y,z);
    this.transform.actor.render.updateScreen();
    this.transform.actor.nametag.updateScreen();
    var newZDepth = this.transform.actor.calcZDepth();
    if(newZDepth != this.transform.actor.render.sprite.zDepth) {
        //console.log('actor: updating zbuffer after move');
        this.transform.actor.game.renderer.updateZBuffer(
            this.transform.actor.render.sprite.zDepth, this.transform.actor.render.sprite.sprite, newZDepth
        );
        this.transform.actor.render.sprite.zDepth = newZDepth;
    }
};

Move.prototype.startMove = function() {
    //console.log('actor: startMove');
    this.moveStart = this.transform.actor.game.ticks;
    //console.log('actor: creating placeholder at',this.destination.x,this.destination.y,this.destination.z);
    this.movePlaceholder = new Placeholder(this.transform, {
        x: this.destination.x, y: this.destination.y, z: this.destination.z
    });
    this.transform.unWalkable = true; // Prevent others from jumping on me
    delete this.transform.actor.game.world.walkable[this.transform.position.x+':'+this.transform.position.y];
    //console.log('actor: deleting walkable at',this.position.x,this.position.y);
    var destDelta = {
        x: this.destination.x - this.transform.position.x,
        y: this.destination.y - this.transform.position.y,
        z: this.destination.z - this.transform.position.z
    };
    this.transform.actor.facing = destDelta.x < 0 ? 'west' : destDelta.x > 0 ? 'east' : destDelta.y < 0 ? 'north' : 'south';
    this.transform.actor.render.halfZDepth = (this.transform.position.x + this.transform.position.y + (destDelta.x + destDelta.y)/2);
    var moveDuration = 13 * 3; // Duration of move, in ticks
    this.transform.actor.emit('move-start',moveDuration);
    var self = this;
    this.transform.actor.tickRepeat(function(progress) {
        self.moveProgress = progress.percent;
        if(progress.ticks == moveDuration) {
            //console.log('actor: move complete');
            //console.log('actor: removing placeholder');
            self.movePlaceholder.remove();
            delete self.transform.move.movePlaceholder;
            if(!self.transform.actor.bubble) self.transform.unWalkable = false;
            //console.log('actor: moving to',self.destination.x,self.destination.y,self.destination.z);
            self.moveTo(self.destination.x, self.destination.y, self.destination.z);
            self.destination = false;
            self.transform.actor.emit('move-complete');
            self.transform.actor.render.updateSprite();
        }
        self.nametag.updateScreen();
    }, moveDuration);
};