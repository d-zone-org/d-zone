'use strict';

module.exports = Sprite3D;

function Sprite3D() {
    this.data = {
        sheet: null, // Must be defined
        sheetX: 0,
        sheetY: 0,
        sheetW: 0, // Must be more than 0
        sheetH: 0, // Must be more than 0
        dox: 0,
        doy: 0,
        x: 0,
        y: 0,
        z: 0,
        dx: 0,
        dy: 0,
        zDepth: 0
    };
}