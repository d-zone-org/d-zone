'use strict';
var PIXI = require('pixi.js');
var actorConfig = require('./config');
var TextureManager = require('man-texture');
TextureManager.waitForLoaded(prepareSprites);

function prepareSprites() {
    TextureManager.createTextures('actors', actorConfig().textures);
}

module.exports = {
    createActorSprite(facing) {
        facing = facing || 'east';
        var spriteConfig = actorConfig().sprites.idle[facing];
        var sprite = new PIXI.Sprite(TextureManager.getTexture(...spriteConfig.texturePath, facing));
        sprite.interactive = true;
        Object.assign(sprite, spriteConfig);
        sprite.hitArea = new PIXI.Polygon(spriteConfig.hitArea); // Maybe use PIXI.Circle?
        return sprite;
    },
    turn(sprite, direction) {
        var spriteConfig = actorConfig().sprites.idle[direction];
        sprite.texture = TextureManager.getTexture(...spriteConfig.texturePath, direction);
    }
};