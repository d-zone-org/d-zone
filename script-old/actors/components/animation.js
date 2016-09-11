'use strict';

module.exports = Animation;

function Animation(render) {
    this.render = render;
    
    var self = this;
    this.render.actor.on('move-start', function(duration) {
        self.current = 'move';
        self.animation = self.render.sheet.map['hopping'];
        self.frame = 0;
        self.tick = 0;
        self.duration = duration;
    });
    this.render.actor.on('talk-start', function() {
        self.talking = true;
        self.talkTick = 0;
    });
    this.render.actor.on('talk-complete', function() {
        self.talking = false;
    });
}

Animation.prototype.onUpdate = function(metrics) {
    this.metrics = metrics;
    if(this.current == 'move') {
        this.animateMove();
    } else if(this.talking) {
        metrics.y += (Math.floor(this.talkTick / 4) % 4) * metrics.h;
        if(metrics.y > 42) {
            console.error(this.talkTick,metrics.y,this);
            this.render.actor.game.paused = true;
        }
        this.talkTick++;
    }
};

Animation.prototype.animateMove = function() {
    this.frame = Math.floor(this.tick / this.duration * this.animation.frames);
    var newFrame = this.prevFrame != this.frame;
    if(newFrame && this.frame == 6) { // Move zDepth half-way between tiles
        this.render.setZDepth(this.render.halfZDepth);
    } else if(newFrame && this.frame == 8) { // Move zDepth all the way
        this.render.setZDepth(
            this.render.actor.transform.move.destination.x + this.render.actor.transform.move.destination.y
        );
    }
    this.metrics.x += (this.frame) * this.metrics.w;
    if(this.frame > this.animation.zStartFrame) {
        if(this.render.actor.transform.move.destination.z > this.render.actor.position.z) {
            this.metrics.oy -= Math.min(8,this.frame - this.animation.zStartFrame);
        } else if(this.render.actor.transform.move.destination.z < this.render.actor.position.z) {
            this.metrics.oy += Math.min(8, this.frame - this.animation.zStartFrame);
        }
    }

    this.tick++;
    this.prevFrame = this.frame;
    if(this.tick == this.duration) delete this.current; // Animation complete
};