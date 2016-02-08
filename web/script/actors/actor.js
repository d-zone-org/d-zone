'use strict';
var inherits = require('inherits');
var Geometry = require('./../common/geometry.js');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var TextBox = require('./../common/textbox.js');
var Wander = require('./behaviors/wander.js');
var GoTo = require('./behaviors/goto.js');
var Collect = require('./behaviors/collect.js');
var Bubble = require('./bubble.js');

module.exports = Actor;
inherits(Actor, WorldObject);

function Actor(options) {
    WorldObject.call(this, {
        position: { x: options.x, y: options.y, z: options.z },
        height: 0.5
    });
    this.transform = new (require('./components/transform.js'))(this);
    this.setMaxListeners(options.maxListeners);
    this.uid = options.uid;
    this.username = options.username;
    this.presence = 'offline';
    this.talking = false;
    this.facing = util.pickInObject(Geometry.DIRECTIONS);
    this.behaviors = [];
    this.boundOnUpdate = this.onUpdate.bind(this);
    this.boundOnMessage = this.onMessage.bind(this);
    this.roleColor = options.roleColor;
    this.render = new (require('./components/render.js'))(this);
}

Actor.prototype.onUpdate = function() {
    this.render.onUpdate();
    if(this.bubble) this.bubble.update();
    if(this.game.mouseOut || (this.game.mouseOver 
        && (this.game.mouseOver.render.sprite.zDepth > this.render.sprite.zDepth // Don't override closer objects
        || this.game.mouseOver.position.z > this.position.z)) // Don't override higher objects
    || this.game.ui.mouseOnElement) return; // Ignore if mouse on UI element
    var mouse = { 
        x: this.game.centerMouseX - this.game.renderer.canvases[0].panning.panned.x,
        y: this.game.centerMouseY - this.game.renderer.canvases[0].panning.panned.y
    };
    var metrics = this.render.sheet.map.online.north;
    var preciseScreen = this.render.getPreciseScreen();
    if(mouse.x >= preciseScreen.x + metrics.ox
        && mouse.x < preciseScreen.x + metrics.w + metrics.ox
        && mouse.y >= preciseScreen.y + metrics.oy
        && mouse.y <  preciseScreen.y + metrics.h + metrics.oy) {
        this.game.mouseOver = this;
    } else if(this.game.mouseOver === this) {
        this.game.mouseOver = false;
    }
};

Actor.prototype.addToGame = function(game) {
    this.game = game;
    this.game.entities.push(this);
    this.game.world.addToWorld(this.transform);
    this.render.show();
    if(this.roleColor) this.game.renderer.addColorSheet({
        sheet: 'actors', color: this.roleColor, alpha: 0.8,
        regions: [{ alpha: 0.4, x: 70, y: 0, w: 28, h: 14 }] // Less colorizing for offline sprites
    });
    this.nametag = new TextBox(this, this.username);
    this.nametag.blotText();
    this.nametag.addToGame(game);
    this.game.on('update', this.boundOnUpdate);
    this.game.users.on('message', this.boundOnMessage);
    this.exists = true;
};

Actor.prototype.remove = function() {
    this.exists = false;
    this.game.world.removeFromWorld(this.transform);
    util.findAndRemove(this, this.game.entities);
    this.render.hide();
    this.game.removeListener('update', this.boundOnUpdate);
    this.game.users.removeListener('message', this.boundOnMessage);
    if(this.game.mouseOver === this) {
        this.game.mouseOver = false;
    }
    if(this.bubble) this.bubble.remove();
};

Actor.prototype.updatePresence = function(presence) {
    this.presence = presence ? presence : 'offline';
    this.emit('presence',this.presence);
    if(this.presence == 'offline' || this.presence == 'idle') {
        for(var i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].detach();
        }
        this.behaviors = [];
    } else if(this.behaviors.length == 0) { // If coming online and have no behaviors already
        this.addBubble();
        this.behaviors.push(new Wander(this));
    }
    this.render.updateSprite();
};

Actor.prototype.startTalking = function(message, channel, onStop) {
    this.talking = true;
    this.lastChannel = channel;
    this.nametag.sprite.hidden = true;
    this.messageBox = new TextBox(this, message, true);
    this.messageBox.addToGame(this.game);
    var self = this;
    var scrollSpeed = message.length > 150 ? 1 : message.length > 75 ? 2 : 3;
    self.emit('talk-start');
    this.messageBox.scrollMessage(scrollSpeed, 4, function() {
        delete self.messageBox;
        self.talking = false;
        self.nametag.sprite.hidden = false;
        self.render.updateSprite();
        self.emit('talk-complete');
        self.addBubble();
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
        if(self.move.destination) {
            self.once('move-complete', readyToMove);
        } else {
            readyToMove();
        }
    }, util.randomIntRange(0,60)); // To prevent everyone pathfinding on the same tick
};

Actor.prototype.addBubble = function() {
    if(this.bubble) return;
    this.bubble = new Bubble({parent:this});
    this.transform.unWalkable = true;
    this.game.world.updateWalkable(this.position.x,this.position.y);
    this.collect = new Collect(this,'actor');
};

Actor.prototype.removeBubble = function() {
    if(!this.bubble) return;
    this.bubble.remove();
    delete this.bubble;
    this.transform.unWalkable = false;
    this.game.world.updateWalkable(this.position.x,this.position.y);
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
    if(this.transform.move.destination) {
        this.once('move-complete', readyToMove);
    } else {
        readyToMove();
    }
};

Actor.prototype.stopGoTo = function(gotoBehavior) {
    gotoBehavior.detach();
    this.behaviors = [];
    this.updatePresence(this.presence);
};