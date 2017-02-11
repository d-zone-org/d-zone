'use strict';
var util = require('dz-util');
var Canvas = require('canvas');
var Map2D = require('map2d');
var SpriteManager = require('man-sprite');
var RenderSystem = require('sys-render');
var view = require('man-view').view;

var tileSheet;
var tileWidth = 32,
    tileHeight = tileWidth / 2,
    halfTileHeight = tileHeight / 2;
var segmentSize = 32,
    segmentTileWidth = segmentSize + 1,
    segmentTileHeight = segmentSize * 2 + 1,
    segmentImageWidth = segmentSize * tileWidth,
    segmentImageHeight = segmentImageWidth / 2;
var segments; // Store map tile segments
var segmentX1 = 0, segmentY1 = 0, // Current top-left bounds
    segmentX2 = 0, segmentY2 = 0; // Current bottom-right bounds
var viewedSegments = [], // Segment indexes currently in view, 2D array
    segmentCache = {};

function onViewChange() {
    var newSX1 = Math.floor((view.centerX - view.width / 2) / segmentImageWidth),
        newSY1 = Math.floor((view.centerY - view.height / 2) / segmentImageHeight),
        newSX2 = Math.ceil((view.centerX + view.width / 2) / segmentImageWidth),
        newSY2 = Math.ceil((view.centerY + view.height / 2) / segmentImageHeight);
    if(newSX1 - segmentX1 === 0 && newSY1 - segmentY1 === 0 
        && newSX2 - segmentX2 === 0 && newSY2 - segmentY2 === 0) return;
    segmentX1 = newSX1;
    segmentY1 = newSY1;
    segmentX2 = newSX2;
    segmentY2 = newSY2;
    viewedSegments = [];
    var newCache = {};
    for(let sx = segmentX1; sx <= segmentX2; sx++) {
        let ySegments = [];
        for(let sy = segmentY1; sy <= segmentY2; sy++) {
            var segment = segmentCache[sx + ':' + sy] || drawSegment(sx, sy);
            newCache[sx + ':' + sy] = segment;
            ySegments.push(segment);
        }
        viewedSegments.push(ySegments);
    }
    segmentCache = newCache;
    RenderSystem.setBGSegments(viewedSegments);
}

function drawSegment(x, y) {
    if(x < 0 || x >= segments.width || y < 0 || y >= segments.height) return false;
    var segmentTiles = segments.getXY(x, y);
    if(!segmentTiles) return false;
    var segmentCanvas = new Canvas(segmentImageWidth, segmentImageHeight);
    for(var i = 0; i < segmentTiles.dataArray.length; i++) {
        var tileValue = segmentTiles.dataArray[i];
        if(!tileValue) continue;
        var sheetX = tileValue % 16 * tileWidth,
            sheetY = (tileValue >> 4) * tileHeight;
        var row = i % segmentTiles.height;
        var drawX = Math.floor(i / segmentTiles.height) * tileWidth - tileHeight * (1 - row & 1),
            drawY = (row - 1) * halfTileHeight;
        segmentCanvas.drawImage(tileSheet,sheetX,sheetY,tileWidth,tileHeight,drawX,drawY);
    }
    return segmentCanvas.canvas;
}

module.exports = {
    createSegments(world) { // Create segment maps of tiles after isometric rotation
        segmentImageWidth = Math.min(world.size * tileWidth + tileWidth, segmentImageWidth);
        segmentImageHeight = Math.min(world.size * tileHeight + tileHeight, segmentImageHeight);
        var worldSegmentSize = Math.max(1, Math.floor((world.size + 1) / segmentSize));
        segments = new Map2D(Array, worldSegmentSize);
        var projectedTiles = new Map2D(Uint8Array, world.size + 1, world.size * 2 + 1);
        world.tiles.forEachTileIntersection(function(nw, ne, se, sw, ix, iy) {
            var shape = (nw & 1) | (ne & 1) << 1 | (se & 1) << 2 | (sw & 1) << 3, // 0-15
                ring = (nw + ne + se + sw) >> 2; // 0:ES, 1:SG, 2:GF, 3:F
            if(shape === 0 && ring === 0) return;
            var drawX = Math.floor((ix - iy) / 2) + world.radius,
                drawY = ix + iy;
            var sheetXY = getTile(ring, shape);
            projectedTiles.setXY(drawX, drawY, (sheetXY.y << 4) | sheetXY.x);
        });
        for(var sx = 0; sx < segments.width; sx++) { for(var sy = 0; sy < segments.height; sy++) {
            var tileX = sx * segmentSize,
                tileY = sy * segmentSize * 2,
                tileX2 = Math.min(world.size + 1, tileX + segmentTileWidth),
                tileY2 = Math.min(world.size * 2 + 1, tileY + segmentTileHeight),
                xTiles = tileX2 - tileX, yTiles = tileY2 - tileY;
            var segmentTiles = projectedTiles.getBox(tileX, tileY, xTiles, yTiles);
            var segmentTileCount = 0; // Check if segment is empty
            for(var i = 0; i < segmentTiles.length; i++) {
                if(segmentTiles[i]) segmentTileCount++;
            }
            var segment = segmentTileCount ? new Map2D(Uint8Array, xTiles, yTiles, segmentTiles) : false;
            segments.setXY(sx, sy, segment);
        }}
        world.segmentImageSize = { w: segmentImageWidth, h: segmentImageHeight };
        world.imageCenter = {
            x: world.size * tileHeight,
            y: world.size * halfTileHeight
        };
        SpriteManager.waitForLoaded(function() {
            tileSheet = SpriteManager.sheets['static-tiles'];
            onViewChange();
            view.events.on('view-change', onViewChange);
        });
    }
};

function getTile(ring, shape) {
    if(ring & 1) { // Reverse shape for odd ring numbers
        shape = shape ^ 15;
    }
    if(ring === 2 && shape === 0) { // Grass variation
        ring = 4;
        shape = util.random(2);
        var random = Math.random();
        if(random > 0.985) shape = 8;
        else if(random > 0.95) shape = util.random(5, 7);
        else if(random > 0.6) shape = util.random(3, 4);
    }
    return { x: shape, y: ring }; // To be multiplied by tile dimensions when drawing
}