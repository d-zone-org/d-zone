'use strict';
var util = require('dz-util');
var COLLIDER = require('com-collider');
var SPRITE3D = require('com-sprite3d');

module.exports = Actor;

function Actor(sprite) {
    var data = [
        [SPRITE3D, {
            sheet: 'actors',
            sheetX: 14,
            sheetY: 0,
            sheetW: 14,
            sheetH: 14,
            dox: -7,
            doy: -4
        }]
    ];
    if(sprite) util.mergeObjects(data[0][1], sprite); // Apply custom data
    return data;
}