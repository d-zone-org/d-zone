'use strict';
var ViewManager = require('man-view.js');
var UIManager = require('ui/manager');
var PIXI = require('pixi.js');

// TODO: Use chunk system to reduce culling and zDepth calculations

var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: false, backgroundColor: 0x1d171f }),
    stage = new PIXI.Container(), // Main container used by game renderer
    sprites = new PIXI.Container(); // Non-bg game sprites
// stage = new PIXI.particles.ParticleContainer(100000);
stage.addChild(sprites);
var dirtyView; // Flag for re-culling sprites

ViewManager.init(renderer, stage);
var view = ViewManager.view;

var spriteData, transformData; // Reference to sprite and transform data
var zBuffer = []; // Array of Z-depths, each containing depth-sorted sprites
var entityZDepths = []; // Z-depths indexed by entity
var dirtyBuffer; // Indicates whether Z-buffer needs rebuilding
var minZDepth; // Lowest possible entity Z-depth

view.events.on('view-change', function(){
    dirtyView = true;
});

module.exports = {
    init(getComponentData) {
        spriteData = getComponentData(require('com-sprite3d'));
        transformData = getComponentData(require('com-transform'));
    },
    setWorldSize(worldSize) { // World size determines range of Z-depths
        minZDepth = worldSize * -2;
        for(var i = 0; i < minZDepth * -2; i++) {
            zBuffer.push([]);
        }
    },
    getDrawX: getDrawX,
    getDrawY: getDrawY,
    render() {
        if(dirtyBuffer) {
            sprites.children.length = 0;
            for(var b = 0; b < zBuffer.length; b++) {
                if(zBuffer[b].length) {
                    sprites.children.push(...zBuffer[b]);
                }
            }
            dirtyBuffer = false;
        }
        if(dirtyView) { // If view was changed, refresh sprite culling
            var sprite;
            for(var i = 0; i < sprites.children.length; i++) {
                sprite = sprites.children[i];
                sprites.children[i].visible = sprite.x + sprite.width > -stage.x
                    && sprite.x < view.width - stage.x
                    && sprite.y + sprite.height >  -stage.y
                    && sprite.y < view.height - stage.y;
            }
            dirtyView = false;
        }
        renderer.render(stage);
        UIManager.render();
    },
    updateSprite(entity) {
        var sprite = spriteData[entity];
        if(!sprite) return;
        sprite.x = sprite.dx + sprite.dox;
        sprite.y = sprite.dy + sprite.doy;
        sprite.visible = sprite.x + sprite.width > -stage.x && sprite.x < view.width - stage.x
            && sprite.y + sprite.height >  -stage.y && sprite.y < view.height - stage.y;
    },
    updateTransform(entity) {
        var transform = transformData[entity];
        if(!transform) return;
        var sprite = spriteData[entity];
        if(!sprite) return;
        var oldZDepth = sprite.zDepth;
        var oldDY = sprite.dy;
        sprite.dx = getDrawX(transform.x, transform.y);
        sprite.dy = getDrawY(transform.x, transform.y, transform.z);
        sprite.x = sprite.dx + sprite.dox;
        sprite.y = sprite.dy + sprite.doy;
        sprite.zDepth = (transform.x + transform.y) * 2 - minZDepth;
        sprite.visible = sprite.x + sprite.width > -stage.x && sprite.x < view.width - stage.x
            && sprite.y + sprite.height >  -stage.y && sprite.y < view.height - stage.y;
        if(sprite.zDepth !== oldZDepth || sprite.dy !== oldDY) updateZBuffer(entity, sprite);
    },
    adjustZDepth(entity, sprite, delta) {
        sprite.zDepth += delta;
        updateZBuffer(entity, sprite);
    },
    addToStage(entity) {
        spriteData[entity].setParent(sprites);
    },
    removeSprite,
    renderer, stage
};

function updateZBuffer(entity, sprite) {
    dirtyBuffer = true;
    sprite.entity = entity;
    if(entityZDepths[entity]) removeSprite(entity);
    entityZDepths[entity] = sprite.zDepth;
    var zBufferDepth = zBuffer[sprite.zDepth];
    var spriteAdded = false;
    for(var i = 0; i < zBufferDepth.length; i++) {
        if(sprite.dy >= zBufferDepth[i].dy) {
            zBufferDepth.splice(i, 0, sprite);
            spriteAdded = true;
            break;
        }
    }
    if(!spriteAdded) zBufferDepth.push(sprite);
}

function removeSprite(entity) {
    var oldZBufferDepth = zBuffer[entityZDepths[entity]];
    for(var i = 0; i < oldZBufferDepth.length; i++) {
        if(oldZBufferDepth[i].entity === entity) {
            oldZBufferDepth.splice(i, 1);
            break;
        }
    }
    entityZDepths[entity] = undefined;
    dirtyBuffer = true;
}

function getDrawX(x, y) {
    return (x - y) * 16;
}

function getDrawY(x, y, z) {
    return (x + y) * 8 - z * 8;
}