'use strict';
var inherits = require('inherits');
var Entity = require('./../engine/entity.js');
var util = require('./../common/util.js');
var Sheet = require('./sheet.js');

module.exports = Bubble;
inherits(Bubble, Entity);

function Bubble(options) {
    console.log('creating bubble for',options.parent.username);
    this.clip = true;
    this.parent = options.parent;
    this.position = {
        x: this.parent.precisePosition.x, 
        y: this.parent.precisePosition.y, 
        z: this.parent.precisePosition.z + 1
    };
    this.zDepth = this.parent.zDepth;
    this.sheet = new Sheet('bubble');
    this.screen = { x: 0, y: 0 };
    this.sprite = {
        screen: this.screen, metrics: this.sheet.map, image: 'actors', 
        position: this.position, parent: this.parent, stay: true
    };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.update();
}

Bubble.prototype.update = function() {
    if(!this.game) return;
    // Springy follow
    var lag = {
        x: this.parent.precisePosition.x - this.position.x,
        y: this.parent.precisePosition.y - this.position.y,
        z: this.parent.precisePosition.z + 1 - this.position.z
    };
    this.velocity.x = util.clamp(0.94 * (this.velocity.x + Math.pow(lag.x*2.5,3)),-0.5,0.5);
    this.velocity.y = util.clamp(0.94 * (this.velocity.y + Math.pow(lag.y*2.5,3)),-0.5,0.5);
    this.velocity.z = util.clamp(0.9 * (this.velocity.z + Math.pow(lag.z,3)),-0.5,0.5);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;
    if(this.zDepth != this.parent.zDepth) {
        this.game.renderer.updateZBuffer(this.zDepth,this.sprite,this.parent.zDepth);
        this.zDepth = this.parent.zDepth;
    }
    this.updateScreen();
};

Bubble.prototype.updateScreen = function() {
    this.screen.x = (this.position.x - this.position.y) * 16;
    this.screen.y = (this.position.x + this.position.y) * 8 - this.position.z * 16;
};