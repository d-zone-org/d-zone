'use strict';
var inherits = require('inherits');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var BetterCanvas = require('./../common/bettercanvas.js');
var Sheet = require('./sheet.js');

module.exports = Seed;
inherits(Seed, WorldObject);

function Seed(options) {
    this.unwalkable = true;
    WorldObject.call(this, {
        position: { x: options.destination.x, y: options.destination.y, z: options.destination.z },
        pixelSize: { x: 12, y: 12, z: 16 },
        height: 1
    });
    this.origin = options.origin;
    //var canvas = new BetterCanvas(1,1);
    var self = this;
    this.on('draw',function(canvas) {
        if(self.exists) canvas.drawEntity(self);
    });
    this.sheet = new Sheet('seed');
    this.sprite.image = 'props';
    this.sprite.metrics = this.sheet.map.plant;
    this.boundGrow = this.grow.bind(this);
    this.boundWither = this.wither.bind(this);
    this.growTime = 80;
    this.growStage = 0;
}

Seed.prototype.addToGame = function(game) {
    WorldObject.prototype.addToGame.call(this, game);
    this.tickDelay(this.boundGrow, this.growTime + util.randomIntRange(this.growTime/-6,this.growTime/6));
};

Seed.prototype.grow = function() {
    this.growStage++;
    var metrics = JSON.parse(JSON.stringify(this.sheet.map.plant));
    metrics.x += this.sprite.metrics.w * this.growStage;
    this.sprite.metrics = metrics;
    var nextGrowth = this.growTime + util.randomIntRange(this.growTime/-6,this.growTime/6);
    if(this.growStage < 5) {
        this.tickDelay(this.boundGrow, nextGrowth);
    } else {
        this.tickDelay(this.boundWither, Math.floor(nextGrowth/2));
    }
};

Seed.prototype.wither = function() {
    var metrics = this.sheet.map.orb;
    this.sprite.metrics = JSON.parse(JSON.stringify(metrics));
    var self = this;
    this.tickRepeat(function(progress){
        self.sprite.metrics.oy = Math.round(metrics.oy + progress.ticks/2);
        if(progress.percent >= 1) self.growthStage = 6;
    },26);
};

//Seed.prototype.onUpdate = function() {
    //if(this.position.z > 0) {
    //    this.velocity.z = Math.max(-0.02,this.velocity.z-0.0001);
    //    this.velocity.x = util.clamp(this.velocity.x + util.randomIntRange(-1,1)/1000,-0.01,0.01);
    //    this.velocity.y = util.clamp(this.velocity.y + util.randomIntRange(-1,1)/1000,-0.01,0.01);
    //    this.position.x += this.velocity.x;
    //    this.position.y += this.velocity.y;
    //    this.position.z = Math.max(0,this.position.z + this.velocity.z);
    //    this.zDepth = this.calcZDepth();
    //    this.updateScreen();
    //} else {
    //    this.velocity.z = 0; this.velocity.x = 0; this.velocity.y = 0;
    //}
//};

//Seed.prototype.calcZDepth = function() {
//    return Math.round(this.position.x) + Math.round(this.position.y);
//};