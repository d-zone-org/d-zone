'use strict';
var PIXI = require('pixi.js');
var worldConfig = require('./config');
var TextureManager = require('man-texture');
TextureManager.waitForLoaded(prepareSprites);

var textures = {};

function prepareSprites() {
    var textureConfig = worldConfig().textures;
    TextureManager.createTextures('props', textureConfig);
}

module.exports = {
    createBeaconSprite() {
        var spriteConfig = worldConfig().sprites.beacon;
        var beacon = new PIXI.Sprite(TextureManager.getTexture(...spriteConfig.texturePath));
        Object.assign(beacon, spriteConfig);
        return beacon;
    },
    textures
};