'use strict';
var PIXI = require('pixi.js');
var worldConfig = require('./config');
var TextureManager = require('man-texture');
TextureManager.waitForLoaded(prepareSprites);

var textures = {};

function prepareSprites() {
    var spriteConfig = worldConfig().sprites;
    TextureManager.createTextures(textures, spriteConfig, 'props', 'sheetW', 'sheetH');
}

module.exports = {
    createBeaconSprite() {
        var beacon = new PIXI.Sprite(textures.props.beacon);
        Object.assign(beacon, worldConfig().sprites.beacon);
        return beacon;
    },
    textures
};