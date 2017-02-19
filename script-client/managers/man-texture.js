'use strict';
var PIXI = require('pixi.js');
PIXI.loader.baseUrl = './img/';

var loaded = false;

module.exports = {
    init(imageNames) {
        for(var i = 0; i < imageNames.length; i++) {
            PIXI.loader.add(imageNames[i], imageNames[i] + '.png');
        }
        PIXI.loader.once('complete', () => { loaded = true; });
        PIXI.loader.load();
    },
    getImage(img) { return PIXI.loader.resources[img].data; },
    getTexture(txt) { return PIXI.loader.resources[txt].texture.baseTexture; },
    waitForLoaded(cb) { if(loaded) cb(); else PIXI.loader.once('complete', cb); },
    createTextures(textures, config, group, widthKey, heightKey) {
        textures[group] = textures[group] || {};
        for(let key in config) {
            if(!config.hasOwnProperty(key)) continue;
            var sheetInfo = config[key];
            var baseTexture = PIXI.loader.resources[sheetInfo.sheet].texture.baseTexture;
            textures[group][key] = new PIXI.Texture(baseTexture, new PIXI.Rectangle(
                sheetInfo.sheetX, sheetInfo.sheetY, sheetInfo[widthKey], sheetInfo[heightKey]
            ));
        }
    },
    loader: PIXI.loader
};