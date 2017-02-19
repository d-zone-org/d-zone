'use strict';
var PIXI = require('pixi.js');
var actorConfig = require('./config');
var TextureManager = require('man-texture');
TextureManager.waitForLoaded(prepareSprites);

var textures = {};

function prepareSprites() {
    var spriteConfig = actorConfig().sprites;
    TextureManager.createTextures(textures, spriteConfig.idle, 'idle', 'sheetW', 'sheetH');
    
    var animConfig = actorConfig().animations;
    textures.hop = {};
}

module.exports = {
    createActorSprite(facing) {
        facing = facing || 'east';
        var spriteConfig = actorConfig().sprites.idle[facing];
        var sprite = new PIXI.Sprite(textures.idle[facing]);
        sprite.interactive = true;
        Object.assign(sprite, spriteConfig);
        sprite.hitArea = new PIXI.Polygon(spriteConfig.hitArea);
        return sprite;
    },
    textures
};