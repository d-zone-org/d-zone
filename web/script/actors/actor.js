'use strict';
var inherits = require('inherits');
var Geometry = require('./../common/geometry.js');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');
var Placeholder = require('./placeholder.js');
var Wander = require('./behaviors/wander.js');
var GoTo = require('./behaviors/goto.js');
var TextBox = require('./../common/textbox.js');

module.exports = Actor;
inherits(Actor, WorldObject);

function Actor(options) {
    WorldObject.call(this, {
        position: { x: options.x, y: options.y, z: options.z },
        pixelSize: { x: 7, y: 7, z: 8 },
        height: 0.5
    });
    this.preciseScreen = this.toScreenPrecise();
    this.setMaxListeners(options.maxListeners);
    this.uid = options.uid;
    this.username = options.username;
    this.nametag = new TextBox(this, this.username);
    this.nametag.blotText();
    this.sheet = new Sheet('actor');
    this.sprite.image = 'actors';
    this.presence = 'offline';
    this.talking = false;
    this.destination = false;
    this.facing = util.pickInObject(Geometry.DIRECTIONS);
    this.behaviors = [];
    this.boundOnMessage = this.onMessage.bind(this);
    this.roleColor = options.roleColor;
    this.updateSprite();
}

Actor.prototype.onUpdate = function() {
    if(this.talking) this.updateSprite();
    if(this.game.mouseOut || (this.game.mouseOver 
        && (this.game.mouseOver.zDepth > this.zDepth // Don't override closer objects
        || this.game.mouseOver.position.z > this.position.z)) // Don't override higher objects
    || this.game.ui.mouseOnElement) return; // Ignore if mouse on UI element
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
    if(this.roleColor) this.game.renderer.addColorSheet({
        sheet: 'actors', color: this.roleColor, alpha: 0.8,
        regions: [{ alpha: 0.4, x: 70, y: 0, w: 28, h: 14 }] // Less colorizing for offline sprites
    });
    this.nametag.addToGame(game);
    this.game.on('update', this.onUpdate.bind(this));
    this.game.users.on('message', this.boundOnMessage);
};

Actor.prototype.updatePresence = function(presence) {
    this.presence = presence || 'offline';
    if(presence == 'dnd') this.presence = 'online';
    if(this.presence == 'offline' || this.presence == 'idle') {
        for(var i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].detach();
        }
        this.behaviors = [];
    } else if(this.behaviors.length == 0) { // If coming online and have no behaviors already
        this.behaviors.push(new Wander(this));
    }
    this.updateSprite();
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

Actor.prototype.updateSprite = function() {
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
        metrics.x += (this.frame) * metrics.w;
        var animation = this.sheet.map['hopping'].animation;
        if(this.frame >= animation.zStartFrame) {
            if(this.destination.z > this.position.z) {
                metrics.oy -= Math.min(8,this.frame - animation.zStartFrame);
            } else if(this.destination.z < this.position.z) {
                metrics.oy += Math.min(8, this.frame - animation.zStartFrame);
            }
        }
    }
    if(this.talking) this.messageBox.updateScreen();
    this.sprite.metrics = metrics;
    this.sprite.image = this.roleColor ? [this.roleColor,'actors'] : 'actors';
};

Actor.prototype.tryMove = function(x,y) {
    if(x == 0 && y == 0) return;
    this.facing = x < 0 ? 'west' : x > 0 ? 'east' : y < 0 ? 'north' : 'south';
    this.updateSprite();
    if(this.underneath()) {
        //console.log('actor: object on top');
        this.emit('getoffme');
        return; // Can't move with object on top
    }
    var newX = this.position.x + x;
    var newY = this.position.y + y;
    var walkable = this.game.world.walkable[newX+':'+newY];
    if(walkable >= 0 && Math.abs(this.position.z - walkable) <= 0.5) {
        //console.log('actor: destination walkable at height',walkable);
        return { x: newX, y: newY, z: walkable };
    }
};

Actor.prototype.startMove = function() {
    //console.log('actor: startMove');
    this.moveStart = this.game.ticks;
    //console.log('actor: creating placeholder at',this.destination.x,this.destination.y,this.destination.z);
    this.movePlaceholder = new Placeholder(this, {
        x: this.destination.x, y: this.destination.y, z: this.destination.z
    });
    this.unWalkable = true; // Prevent others from jumping on me
    delete this.game.world.walkable[this.position.x+':'+this.position.y];
    //console.log('actor: deleting walkable at',this.position.x,this.position.y);
    this.destDelta = {
        x: this.destination.x - this.position.x,
        y: this.destination.y - this.position.y,
        z: this.destination.z - this.position.z
    };
    this.facing = this.destDelta.x < 0 ? 'west' : this.destDelta.x > 0 ? 'east'
        : this.destDelta.y < 0 ? 'north' : 'south';
    this.frame = 0;
    var animation = this.sheet.map['hopping'].animation;
    var halfZDepth = (this.position.x + this.position.y + (this.destDelta.x + this.destDelta.y)/2);
    var self = this;
    this.tickRepeat(function(progress) {
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
            self.unWalkable = false;
            //console.log('actor: moving to',self.destination.x,self.destination.y,self.destination.z);
            self.move(self.destination.x, self.destination.y, self.destination.z, true);
            self.destination = false;
            delete self.frame;
            self.emit('movecomplete');
        } else if(newFrame && self.frame == 6) { // Move zDepth half-way between tiles
            //console.log('actor: half zdepth');
            self.game.renderer.updateZBuffer(self.zDepth, self.sprite, halfZDepth);
            self.zDepth = halfZDepth;
        } else if(newFrame && self.frame == 8) { // Move zDepth all the way
            //console.log('actor: full zdepth');
            self.game.renderer.updateZBuffer(
                halfZDepth, self.sprite, self.destination.x + self.destination.y
            );
            self.zDepth = self.destination.x + self.destination.y;
        }
        self.preciseScreen = self.toScreenPrecise();
        self.nametag.updateScreen();
        self.updateSprite();
    }, 3*(animation.frames));
};

Actor.prototype.move = function(x, y, z, absolute) {
    if(!absolute && x == 0 && y == 0 && z == 0) return;
    var newX = (absolute ? 0 : this.position.x) + x;
    var newY = (absolute ? 0 : this.position.y) + y;
    var newZ = (absolute ? 0 : this.position.z) + z;
    //console.log('actor: moving to',newX,newY,newZ);
    this.game.world.moveObject(this,newX,newY,newZ);
    this.updateScreen();
    this.nametag.updateScreen();
    this.preciseScreen = this.toScreenPrecise();
    var newZDepth = this.calcZDepth();
    if(newZDepth != this.zDepth) {
        //console.log('actor: updating zbuffer after move');
        this.game.renderer.updateZBuffer(this.zDepth, this.sprite, newZDepth);
        this.zDepth = newZDepth;
    }
};

Actor.prototype.startTalking = function(message, channel, onStop) {
    this.talking = true;
    this.lastChannel = channel;
    this.nametag.sprite.hidden = true;
    this.messageBox = new TextBox(this, message, true);
    this.messageBox.addToGame(this.game);
    var self = this;
    this.messageBox.scrollMessage(function() {
        delete self.messageBox;
        self.talking = false;
        self.nametag.sprite.hidden = false;
        self.updateSprite();
        self.emit('donetalking');
        //if(!self.lastSeed || self.game.ticks - self.lastSeed > 60*60) {
        //    self.lastSeed = self.game.ticks;
        //    self.game.decorator.sewSeed({ origin: self.position });
        //}
        onStop();
    });
};

Actor.prototype.onMessage = function(message) { // Move this to the GoTo behavior
    if(!message.channel || message.channel != this.lastChannel || message.user === this 
        || this.presence != 'online') return;
    var self = this;
    function readyToMove() {
        for(var i = 0; i < self.behaviors.length; i++) {
            self.behaviors[i].detach();
        }
        self.behaviors = [new GoTo(self, message.user)];
    }
    this.tickDelay(function() {
        if(Geometry.getDistance(self.position, message.user.position) < 3 // If already nearby
            || self.underneath()) return; // Or if something on top of actor
        if(self.destination) {
            self.once('movecomplete', readyToMove);
        } else {
            readyToMove();
        }
    }, util.randomIntRange(0,60)); // To prevent everyone pathfinding on the same tick
};

Actor.prototype.goto = function(x,y) {
    var self = this;
    function readyToMove() {
        for(var i = 0; i < self.behaviors.length; i++) {
            self.behaviors[i].detach();
        }
        self.behaviors = [new GoTo(self, {
            position:{x:x,y:y,z:0},on:function(){},removeListener:function(){}
        })];
    }
    if(this.destination) {
        this.once('movecomplete', readyToMove);
    } else {
        readyToMove();
    }
};

Actor.prototype.stopGoTo = function(gotoBehavior) {
    gotoBehavior.detach();
    this.behaviors = [];
    this.updatePresence(this.presence);
};