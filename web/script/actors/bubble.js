'use strict';
var inherits = require('inherits');
var Entity = require('./../engine/entity.js');
var util = require('./../common/util.js');
var Sheet = require('./sheet.js');

module.exports = Bubble;
inherits(Bubble, Entity);

function Bubble(options) {
    this.clip = true;
    this.parent = options.parent;
    this.initPosition();
    this.zDepth = this.parent.zDepth;
    this.sheet = new Sheet('bubble');
    this.screen = { x: 0, y: 0 };
    this.sprite = {
        screen: this.screen, metrics: this.sheet.map.empty, image: 'actors', 
        position: this.position, parent: this.parent, stay: true
    };
    this.update();
}

Bubble.prototype.addItem = function(item) {
    this.item = item;
    var self = this;
    var onPresence = function(presence) {
        if(presence == 'online') {
            self.item.removeListener('presence',onPresence);
            if(self.parent.destination) { // If parent is moving
                self.parent.once('movecomplete',function(){ // Wait until move is complete
                    self.releaseItem(self.parent.position.x,self.parent.position.y,self.parent.position.z+0.5);
                })
            } else { // Otherwise release it now
                self.releaseItem(self.parent.position.x,self.parent.position.y,self.parent.position.z+0.5);
            }
        }
    };
    this.item.on('presence',onPresence);
    this.sprite.metrics = this.sheet.map.actor;
};

Bubble.prototype.releaseItem = function(x,y,z) {
    this.item.addToGame(this.item.game);
    this.item.move(x,y,z,true);
    this.parent.removeBubble();
};

Bubble.prototype.update = function() {
    if(!this.game) return;
    // Springy follow
    var lag = {
        x: this.parent.precisePosition.x - this.position.x,
        y: this.parent.precisePosition.y - this.position.y,
        z: this.parent.precisePosition.z + 1 - this.position.z
    };
    if(Math.abs(lag.x) > 0.5 || Math.abs(lag.y) > 0.5 || Math.abs(lag.z) > 0.4) {
        this.initPosition(); // Movement too rapid, re-initialize position and velocity
    } else { // Otherwise apply springiness
        this.velocity.x = util.clamp(0.94 * (this.velocity.x + Math.pow(lag.x*2.5,3)),-0.3,0.3);
        this.velocity.y = util.clamp(0.94 * (this.velocity.y + Math.pow(lag.y*2.5,3)),-0.3,0.3);
        this.velocity.z = util.clamp(0.9 * (this.velocity.z + Math.pow(lag.z,3)),-0.3,0.3);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.position.z += this.velocity.z;
    }
    if(this.zDepth != this.parent.zDepth) {
        this.game.renderer.updateZBuffer(this.zDepth,this.sprite,this.parent.zDepth);
        this.zDepth = this.parent.zDepth;
    }
    this.updateScreen();
};

Bubble.prototype.initPosition = function() {
    this.position = {
        x: this.parent.precisePosition.x,
        y: this.parent.precisePosition.y,
        z: this.parent.precisePosition.z + 1
    };
    this.velocity = { x: 0, y: 0, z: 0 };
};

Bubble.prototype.updateScreen = function() {
    this.screen.x = (this.position.x - this.position.y) * 16;
    this.screen.y = (this.position.x + this.position.y) * 8 - this.position.z * 16;
};