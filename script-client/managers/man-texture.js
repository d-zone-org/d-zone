'use strict';
var util = require('dz-util');
var PIXI = require('pixi.js');
PIXI.loader.baseUrl = './img/';

var loaded = false;
var textures = {};

module.exports = {
    init(imageNames) {
        for(var i = 0; i < imageNames.length; i++) {
            PIXI.loader.add(imageNames[i], imageNames[i] + '.png');
        }
        PIXI.loader.once('complete', () => { loaded = true; });
        PIXI.loader.load();
    },
    getImage(img) { return PIXI.loader.resources[img].data; },
    getTexture(...path) {
        return util.traverseObject(textures, path);
    },
    getBaseTexture(txt) { return PIXI.loader.resources[txt].texture.baseTexture; },
    waitForLoaded(cb) { if(loaded) cb(); else PIXI.loader.once('complete', cb); },
    createTextures(group, config) {
        textures[group] = config;
        traverseNode(config);
        function traverseNode(node) {
            if(node.sheet) return true;
            for(var nodeKey in node) {
                if(!node.hasOwnProperty(nodeKey)) continue;
                if(traverseNode(node[nodeKey])) {
                    var baseTexture = PIXI.loader.resources[node[nodeKey].sheet].texture.baseTexture;
                    if(node[nodeKey].frames) {
                        var frames = [];
                        for(var i = 0; i < node[nodeKey].frames; i++) {
                            frames.push(new PIXI.Texture(baseTexture,
                                new PIXI.Rectangle(
                                    node[nodeKey].frameX + node[nodeKey].frameW * node[nodeKey].deltaX * i,
                                    node[nodeKey].frameY + node[nodeKey].frameH * node[nodeKey].deltaY * i,
                                    node[nodeKey].frameW, node[nodeKey].frameH
                                )
                            ));
                        }
                        node[nodeKey] = frames;
                    } else {
                        node[nodeKey] = new PIXI.Texture(baseTexture,
                            new PIXI.Rectangle(node[nodeKey].frameX, node[nodeKey].frameY,
                                node[nodeKey].frameW, node[nodeKey].frameH)
                        );
                    }
                }
            }
        }
    },
    loader: PIXI.loader
};