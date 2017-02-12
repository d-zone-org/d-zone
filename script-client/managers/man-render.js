'use strict';

var spriteData, transformData; // Reference to sprite and transform data
var zBuffer = []; // Array of Z-depths, each containing depth-sorted sprites
var flatZBuffer = []; // Flat list of depth-sorted sprites
var entityZDepths = []; // Z-depths indexed by entity
var dirtyBuffer; // Indicates whether Z-buffer needs rebuilding
var minZDepth; // Lowest possible entity Z-depth

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
    getZDepth: getZDepth,
    getDrawX: getDrawX,
    getDrawY: getDrawY,
    getDrawXY: getDrawXY,
    getZBuffer() {
        if(dirtyBuffer) {
            flatZBuffer.length = 0;
            for(var i = 0; i < zBuffer.length; i++) {
                if(zBuffer[i].length) {
                    flatZBuffer.push(...zBuffer[i]);
                }
            }
            dirtyBuffer = false;
        }
        return flatZBuffer;
    },
    updateSprite(entity) {
        var sprite = spriteData[entity];
        if(!sprite) return;
        sprite.fdx = sprite.dx + sprite.dox;
        sprite.fdy = sprite.dy + sprite.doy;
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
        sprite.fdx = sprite.dx + sprite.dox;
        sprite.fdy = sprite.dy + sprite.doy;
        sprite.zDepth = getZDepth(transform.x, transform.y);
        if(sprite.zDepth !== oldZDepth || sprite.dy !== oldDY) updateZBuffer(entity, sprite);
    },
    adjustZDepth(entity, sprite, delta) {
        sprite.zDepth += delta;
        updateZBuffer(entity, sprite);
    },
    removeSprite
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

function getZDepth(x, y) {
    return (x + y) * 2 - minZDepth;
}

function getDrawX(x, y) {
    return (x - y) * 16;
}

function getDrawY(x, y, z) {
    return (x + y) * 8 - z * 8;
}

function getDrawXY(x, y, z) {
    return [getDrawX(x, y), getDrawY(x, y, z)];
}