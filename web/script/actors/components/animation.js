'use strict';

module.exports = Animation;

function Animation(render) {
    this.render = render;
    
    var self = this;
    this.render.actor.on('move-start', function(duration) {
        self.startAnimation('move',duration);
    });
    this.render.actor.on('talk-start', function() {
        
    });
}

Animation.prototype.startAnimation = function(type,duration) {
    if(this.current == 'move') return; // Don't override move animation
    this.current = type;
    this.animation = this.render.sheet.map['hopping'];
    this.frame = 0;
    this.tick = 0;
    this.duration = duration;
};

Animation.prototype.stopAnimation = function() {
    delete this.current;
    delete this.animation;
    delete this.frame;
    delete this.tick;
    delete this.duration;
};

Animation.prototype.onUpdate = function(metrics) {
    if(!this.current) return;
    this.frame = Math.floor(this.tick / this.duration * this.animation.frames);
    var newFrame = this.prevFrame != this.frame;
    if(newFrame && this.frame == 6) { // Move zDepth half-way between tiles
        this.render.actor.game.renderer.updateZBuffer(
            this.render.sprite.zDepth, this.render.sprite, this.render.halfZDepth
        );
        this.render.sprite.zDepth = this.render.halfZDepth;
    } else if(newFrame && this.frame == 8) { // Move zDepth all the way
        var newZDepth = this.render.actor.transform.move.destination.x + this.render.actor.transform.move.destination.y;
        this.render.actor.game.renderer.updateZBuffer(
            this.render.halfZDepth, this.render.sprite, newZDepth
        );
        this.render.sprite.zDepth = newZDepth;
    }
    metrics.x += (this.frame) * metrics.w;
    if(this.frame >= this.animation.zStartFrame) {
        if(this.render.actor.transform.move.destination.z > this.render.actor.position.z) {
            metrics.oy -= Math.min(8,this.frame - this.animation.zStartFrame);
        } else if(this.render.actor.transform.move.destination.z < this.render.actor.position.z) {
            metrics.oy += Math.min(8, this.frame - this.animation.zStartFrame);
        }
    }
    
    this.tick++;
    this.prevFrame = this.frame;
    if(this.tick == this.duration) this.stopAnimation();
};