'use strict';
var inherits = require('inherits');
var CommonRender = require('./../../components/render.js');
var Animation = require('./animation.js');
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
    this.animation = new Animation(this);
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
    if(this.actor.talking || this.actor.transform.move.destination) this.updateSprite();
};

Render.prototype.updateSprite = function() {
    var facing = this.actor.facing, 
        state = this.actor.transform.move.destination ? 'hopping' : this.actor.presence;
    if(!this.actor.transform.move.destination && this.actor.talking) {
        state = 'online';
        facing = facing == 'north' ? 'east' : facing == 'west' ? 'south' : facing;
    }
    var metrics = {
        x: this.sheet.map[state][facing].x, y: this.sheet.map[state][facing].y,
        w: this.sheet.map[state][facing].w, h: this.sheet.map[state][facing].h,
        ox: this.sheet.map[state][facing].ox, oy: this.sheet.map[state][facing].oy
    };
    this.animation.onUpdate(metrics);
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

Render.prototype.setZDepth = function(zDepth) {
    this.actor.game.renderer.updateZBuffer(this.sprite.zDepth,this.sprite,zDepth);
    this.sprite.zDepth = zDepth;
};

Render.prototype.getPreciseScreen = function() {
    if(this.actor.transform.move.destination && this.actor.transform.move.moveProgress) {
        var xDelta = this.actor.transform.move.destination.x - this.actor.position.x,
            yDelta = this.actor.transform.move.destination.y - this.actor.position.y,
            zDelta = this.actor.transform.move.destination.z - this.actor.position.z;
        xDelta *= this.actor.transform.move.moveProgress;
        yDelta *= this.actor.transform.move.moveProgress;
        zDelta *= this.actor.transform.move.moveProgress;
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