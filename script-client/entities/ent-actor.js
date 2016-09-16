'use strict';

var COLLIDER = require('com-collider');
var SPRITE3D = require('com-sprite3d');

function create(em) {
    em.addComponent(em.addEntity(), SPRITE3D, {
        sheet: 'actors',
        sheetX: 0,
        sheetY: 0,
        sheetW: 14,
        sheetH: 14,
        dox: -5,
        doy: -2
    })
}

module.exports = {
    create: create
};