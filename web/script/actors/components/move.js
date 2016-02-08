'use strict';
var Placeholder = require('./../placeholder.js');
var GoTo = require('./../behaviors/goto.js');

module.exports = Move;

function Move(actor) {
    this.actor = actor;
    this.destination = false;
    this.moveProgress = 0;
}

Move.prototype.tryMove = function(x,y) {
    var xDelta = x - this.actor.position.x,
        yDelta = y - this.actor.position.y;
    if(xDelta == 0 && yDelta == 0) return;
    this.facing = xDelta < 0 ? 'west' : xDelta > 0 ? 'east' : yDelta < 0 ? 'north' : 'south';
    this.actor.render.updateSprite();
    if(this.actor.underneath()) {
        //console.log('actor: object on top');
        this.actor.emit('getoffme');
        return; // Can't move with object on top
    }
    var walkable = this.actor.game.world.walkable[x+':'+y];
    if(walkable >= 0 && Math.abs(this.actor.position.z - walkable) <= 0.5) {
        //console.log('actor: destination walkable at height',walkable);
        return { x: x, y: y, z: walkable };
    }
};

Move.prototype.moveTo = function(x,y,z) {
    var deltaX = x - this.actor.position.x,
        deltaY = y - this.actor.position.y,
        deltaZ = z - this.actor.position.z;
    if(deltaX == 0 && deltaY == 0 && deltaZ == 0) return;
    //console.log('actor: moving to',newX,newY,newZ);
    this.actor.game.world.moveObject(this.actor,x,y,z);
    this.actor.render.updateScreen();
    this.actor.nametag.updateScreen();
    var newZDepth = this.actor.calcZDepth();
    if(newZDepth != this.actor.render.sprite.zDepth) {
        //console.log('actor: updating zbuffer after move');
        this.actor.game.renderer.updateZBuffer(
            this.actor.render.sprite.zDepth, this.actor.render.sprite.sprite, newZDepth
        );
        this.actor.render.sprite.zDepth = newZDepth;
    }
};

Move.prototype.startMove = function() {
    //console.log('actor: startMove');
    this.moveStart = this.actor.game.ticks;
    //console.log('actor: creating placeholder at',this.destination.x,this.destination.y,this.destination.z);
    this.actor.movePlaceholder = new Placeholder(this.actor, {
        x: this.destination.x, y: this.destination.y, z: this.destination.z
    });
    this.actor.unWalkable = true; // Prevent others from jumping on me
    delete this.actor.game.world.walkable[this.actor.position.x+':'+this.actor.position.y];
    //console.log('actor: deleting walkable at',this.position.x,this.position.y);
    this.actor.destDelta = {
        x: this.destination.x - this.actor.position.x,
        y: this.destination.y - this.actor.position.y,
        z: this.destination.z - this.actor.position.z
    };
    this.actor.facing = this.actor.destDelta.x < 0 ? 'west' : this.actor.destDelta.x > 0 ? 'east'
        : this.actor.destDelta.y < 0 ? 'north' : 'south';
    this.actor.frame = 0;
    var animation = this.actor.render.sheet.map['hopping'].animation;
    var halfZDepth = (this.actor.position.x + this.actor.position.y + (this.actor.destDelta.x + this.actor.destDelta.y)/2);
    var self = this.actor;
    this.actor.tickRepeat(function(progress) {
        self.move.moveProgress = progress.percent;
        var newFrame = false;
        if(progress.ticks > 0 && progress.ticks % 3 == 0) {
            self.frame++; newFrame = true;
            //console.log('actor: new move frame');
        }
        if(self.frame == animation.frames) {
            //console.log('actor: move complete');
            //console.log('actor: removing placeholder');
            self.movePlaceholder.remove();
            delete self.movePlaceholder;
            if(!self.bubble) self.unWalkable = false;
            //console.log('actor: moving to',self.destination.x,self.destination.y,self.destination.z);
            self.move.moveTo(self.move.destination.x, self.move.destination.y, self.move.destination.z);
            self.move.destination = false;
            delete self.frame;
            self.emit('movecomplete');
        } else if(newFrame && self.frame == 6) { // Move zDepth half-way between tiles
            //console.log('actor: half zdepth');
            self.game.renderer.updateZBuffer(self.render.sprite.zDepth, self.render.sprite, halfZDepth);
            self.render.sprite.zDepth = halfZDepth;
        } else if(newFrame && self.frame == 8) { // Move zDepth all the way
            //console.log('actor: full zdepth');
            self.game.renderer.updateZBuffer(
                halfZDepth, self.render.sprite, self.move.destination.x + self.move.destination.y
            );
            self.render.sprite.zDepth = self.move.destination.x + self.move.destination.y;
        }
        self.nametag.updateScreen();
        self.render.updateSprite();
    }, 3*(animation.frames));
};

Move.prototype.goto = function(x,y) {
    var self = this.actor;
    function readyToMove() {
        for(var i = 0; i < self.behaviors.length; i++) {
            self.behaviors[i].detach();
        }
        self.behaviors = [new GoTo(self, {
            position:{x:x,y:y,z:0},on:function(){},removeListener:function(){}
        })];
    }
    if(this.destination) {
        this.actor.once('movecomplete', readyToMove);
    } else {
        readyToMove();
    }
};

Move.prototype.stopGoTo = function(gotoBehavior) {
    gotoBehavior.detach();
    this.actor.behaviors = [];
    this.actor.updatePresence(this.actor.presence);
};