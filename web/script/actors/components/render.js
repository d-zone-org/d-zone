'use strict';
var inherits = require('inherits');
var CommonRender = require('./../../components/render.js');
var Sheet = require('./../sheet.js');

module.exports = Render;
inherits(Render, CommonRender);

function Render(actor) {
    this.actor = actor;
    this.sheet = new Sheet('actor');
    this.sprite = {
        image: 'actors',
        screen: { x: 0, y: 0 },
        position: actor.position,
        zDepth: 0
    };
}

Render.prototype.show = function() {
    this.updateSprite();
    this.updateScreen();
    this.actor.game.renderer.addToZBuffer(this.sprite, this.sprite.zDepth);
};

Render.prototype.hide = function() {
    this.actor.game.renderer.removeFromZBuffer(this.sprite, this.sprite.zDepth);
};

Render.prototype.onUpdate = function() {
    if(this.actor.talking) this.updateSprite();
};

Render.prototype.updateSprite = function() {
    var facing = this.actor.facing, state = this.actor.move.destination ? 'hopping' : this.actor.presence;
    if(!this.actor.move.destination && this.actor.talking) {
        state = 'online';
        facing = facing == 'north' ? 'east' : facing == 'west' ? 'south' : facing;
    }
    var metrics = {
        x: this.sheet.map[state][facing].x, y: this.sheet.map[state][facing].y,
        w: this.sheet.map[state][facing].w, h: this.sheet.map[state][facing].h,
        ox: this.sheet.map[state][facing].ox, oy: this.sheet.map[state][facing].oy
    };
    if(!this.actor.move.destination && this.actor.talking) {
        metrics.y += (Math.floor(this.actor.game.ticks / 4) % 4) * metrics.h;
    } else if(this.actor.move.destination) {
        metrics.x += (this.actor.frame) * metrics.w;
        var animation = this.sheet.map['hopping'].animation;
        if(this.actor.frame >= animation.zStartFrame) {
            if(this.actor.move.destination.z > this.actor.position.z) {
                metrics.oy -= Math.min(8,this.actor.frame - animation.zStartFrame);
            } else if(this.actor.move.destination.z < this.actor.position.z) {
                metrics.oy += Math.min(8, this.actor.frame - animation.zStartFrame);
            }
        }
    }
    if(this.actor.talking) this.actor.messageBox.updateScreen();
    this.sprite.metrics = metrics;
    this.sprite.image = this.actor.roleColor ? [this.actor.roleColor,'actors'] : 'actors';
};

Render.prototype.updateScreen = function() {
    this.sprite.zDepth = this.actor.position.x + this.actor.position.y;
    this.sprite.screen.x = (this.actor.position.x - this.actor.position.y) * 16;
    this.sprite.screen.y = (this.actor.position.x + this.actor.position.y) * 8 
        - (this.actor.position.z + this.actor.height) * 16;
};

Render.prototype.getPreciseScreen = function() {
    if(this.actor.move.destination && this.actor.move.moveProgress) {
        var xDelta = this.actor.move.destination.x - this.actor.position.x,
            yDelta = this.actor.move.destination.y - this.actor.position.y,
            zDelta = this.actor.move.destination.z - this.actor.position.z;
        xDelta *= this.actor.move.moveProgress;
        yDelta *= this.actor.move.moveProgress;
        zDelta *= this.actor.move.moveProgress;
        var deltaScreen = {
            x: (xDelta - yDelta) * 16,
            y: (xDelta + yDelta) * 8 - zDelta * 16
        };
        return {
            x: this.sprite.screen.x + deltaScreen.x,
            y: this.sprite.screen.y + deltaScreen.y
        };
    } else return this.sprite.screen;
};