'use strict';
var inherits = require('inherits');
var Geometry = require('./../common/geometry.js');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');
var Placeholder = require('./placeholder.js');
var Wander = require('./behaviors/wander.js');
var TextBox = require('./../common/textbox.js');

module.exports = Actor;
inherits(Actor, WorldObject);

function Actor(options) {
    WorldObject.call(this, {
        position: { x: options.x, y: options.y, z: options.z },
        pixelSize: { x: 7, y: 7, z: 8 },
        height: 0.5
    });
    this.uid = options.uid;
    this.username = options.username;
    this.nametag = new TextBox(this, this.username);
    this.nametag.blotText();
    this.sheet = new Sheet('actor');
    this.preciseScreen = this.toScreenPrecise();
    var self = this;
    this.on('draw',function(canvas) {
        if(self.exists) canvas.drawEntity(self);
    });
    this.presence = 'offline';
    this.talking = false;
    this.destination = false;
    this.impulseInterval = 75;
    this.facing = util.pickInObject(Geometry.DIRECTIONS);
    this.behaviors = [];
}

Actor.prototype.onUpdate = function() {
    if(this.destination) this.doMove();
    if(this.game.mouseOut || (this.game.mouseOver 
        && (this.game.mouseOver.zDepth > this.zDepth // Don't override closer objects
        || this.game.mouseOver.position.z > this.position.z))) return; // Don't override higher objects
    var mouse = { 
        x: this.game.centerMouseX - this.game.renderer.canvases[0].panning.panned.x,
        y: this.game.centerMouseY - this.game.renderer.canvases[0].panning.panned.y
    };
    var metrics = this.sheet.map.online.north;
    if(mouse.x >= this.preciseScreen.x + metrics.ox
        && mouse.x < this.preciseScreen.x + metrics.w + metrics.ox
        && mouse.y >= this.preciseScreen.y + metrics.oy
        && mouse.y <  this.preciseScreen.y + metrics.h + metrics.oy) {
        this.game.mouseOver = this;
    } else if(this.game.mouseOver === this) {
        this.game.mouseOver = false;
    }
};

Actor.prototype.addToGame = function(game) {
    WorldObject.prototype.addToGame.call(this, game);
    this.nametag.addToGame(game);
    this.game.on('update', this.onUpdate.bind(this));
    this.tickDelay(this.newImpulse.bind(this), Math.random() * this.impulseInterval);
};

Actor.prototype.remove = function() {
    WorldObject.prototype.remove.call(this);
    console.log('removing listener',this.game.listenerCount('update'));
    this.game.removeListener('update',this.onUpdate.bind(this));
    console.log(this.game.listenerCount('update'));
};

Actor.prototype.updatePresence = function(presence) {
    // TODO: Lower saturation on role colored sprite when offline
    this.presence = presence ? presence : 'offline';
    if(this.presence == 'offline' || this.presence == 'idle') {
        for(var i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].detach();
        }
        this.behaviors = [];
    } else if(this.behaviors.length == 0) { // If coming online and have no behaviors already
        this.behaviors.push(new Wander(this));
    }
};

Actor.prototype.toScreenPrecise = function() {
    if(this.destination) {
        var xDelta = this.destination.x - this.position.x,
            yDelta = this.destination.y - this.position.y,
            zDelta = this.destination.z - this.position.z;
        var tick = this.game.ticks - this.moveStart;
        var progress = tick / 40;
        xDelta *= progress;
        yDelta *= progress;
        zDelta *= progress;
        var deltaScreen = {
            x: (xDelta - yDelta) * 16,
            y: (xDelta + yDelta) * 8 - zDelta * 16
        };
        return {
            x: this.screen.x + deltaScreen.x,
            y: this.screen.y + deltaScreen.y
        };
    } else return this.screen;
};

Actor.prototype.getSprite = function() {
    var facing = this.facing, state = this.destination ? 'hopping' : this.presence;
    if(!this.destination && this.talking) {
        state = 'online';
        facing = facing == 'north' ? 'east' : facing == 'west' ? 'south' : facing;
    }
    var metrics = {
        x: this.sheet.map[state][facing].x, y: this.sheet.map[state][facing].y,
        w: this.sheet.map[state][facing].w, h: this.sheet.map[state][facing].h,
        ox: this.sheet.map[state][facing].ox, oy: this.sheet.map[state][facing].oy
    };
    if(!this.destination && this.talking) {
        metrics.y += (Math.floor(this.game.ticks / 4) % 4) * metrics.h;
    } else if(this.destination) {
        var frame = Math.floor((this.game.ticks - this.moveStart)/3) + 1;
        metrics.x += (frame - 1) * metrics.w;
        var animation = this.sheet.map['hopping'].animation;
        if(frame >= animation.zStartFrame) {
            if(this.destination.z > this.position.z) {
                metrics.oy -= Math.min(8,frame + 1 - animation.zStartFrame);
            } else if(this.destination.z < this.position.z) {
                metrics.oy += Math.min(8, frame + 1 - animation.zStartFrame);
            }
        }
    }
    return { metrics: metrics, image: 'actors' };
};

Actor.prototype.setRoleColor = function(color) {
    if(!color) return;
    this.roleColor = color;
    this.game.renderer.addColorSheet('actors',color);
};

Actor.prototype.newImpulse = function() {
    for(var i = 0; i < this.behaviors.length; i++) {
        this.behaviors[i].impulse();
    }
    this.tickDelay(this.newImpulse.bind(this), 15 + Math.random() * this.impulseInterval);
};

Actor.prototype.tryMove = function(x,y,z) {
    if(this.game.world.objectAtXYZ(this.position.x,this.position.y,this.position.z+this.height)) {
        this.emit('getoffme');
        return; // Can't move with object on top
    }
    var newX = this.position.x + x;
    var newY = this.position.y + y;
    var newZ = this.position.z + z;
    var canMove = false;
    var obstruction = this.game.world.objectAtXYZ(newX,newY,newZ);
    if(obstruction) {
        if(!obstruction.invalid && !obstruction.destination
            && obstruction.position.z + obstruction.height <= newZ + 0.5
            && !this.game.world.objectAtXYZ(newX,newY,newZ+0.5)) { // Climb up
            
            canMove = { x: newX, y: newY, z: obstruction.position.z + obstruction.height };
        }
    } else {
        var under = this.game.world.objectUnderXYZ(newX,newY,newZ);
        if(under && !under.invalid && !under.destination 
            && under.position.z + under.height >= newZ - 0.5) { // Level or hop down
            canMove = { x: newX, y: newY, z: under.position.z + under.height };
        }
    }
    return canMove;
};

Actor.prototype.startMove = function() {
    this.moveStart = this.game.ticks;
    this.movePlaceholder = new Placeholder(this,this.destination.x,this.destination.y,this.destination.z);
    this.destDelta = {
        x: this.destination.x - this.position.x,
        y: this.destination.y - this.position.y,
        z: this.destination.z - this.position.z
    };
};

Actor.prototype.doMove = function() {
    var animation = this.sheet.map['hopping'].animation;
    var tick = this.game.ticks - this.moveStart;
    var halfZDepthFrame = this.facing == 'south' || this.facing == 'east';
    if(tick == animation.frames * 3 - 1) {
        this.emit('movecomplete');
        delete this.movePlaceholder;
        delete this.fakeZ;
        this.move(this.destination.x, this.destination.y, this.destination.z, true);
        this.destination = false;
        delete this.moveStart;
    } else if(halfZDepthFrame && tick == 5 * 3 - 1) { // Move zDepth half-way between tiles
        var previousZDepth1 = this.zDepth;
        this.zDepth = (this.position.x + this.position.y + (this.destDelta.x + this.destDelta.y)/2);
        this.game.renderer.updateZBuffer(previousZDepth1, this);
    } else if(tick == 9 * 3 - 1) { // Move zDepth all the way
        var previousZDepth2 = this.zDepth;
        this.zDepth = this.destination.x + this.destination.y;
        if(this.destDelta.z) this.fakeZ = this.destDelta.z;
        this.game.renderer.updateZBuffer(previousZDepth2, this);
    }
    this.preciseScreen = this.toScreenPrecise();
};

Actor.prototype.move = function(x, y, z, absolute) {
    if(x == 0 && y == 0 && z == 0) return;
    var newX = (absolute ? 0 : this.position.x) + x;
    var newY = (absolute ? 0 : this.position.y) + y;
    var newZ = (absolute ? 0 : this.position.z) + z;
    this.game.world.moveObject(this,newX,newY,newZ);
    this.screen = this.toScreen();
    this.preciseScreen = this.toScreenPrecise();
    var previousZDepth = this.zDepth;
    this.zDepth = this.calcZDepth();
    this.game.renderer.updateZBuffer(previousZDepth, this);
};

Actor.prototype.startTalking = function() {
    this.talking = true;
    this.nametag.hidden = true;
};

Actor.prototype.stopTalking = function() {
    this.talking = false;
    this.nametag.hidden = false;
};