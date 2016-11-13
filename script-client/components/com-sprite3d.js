'use strict';

module.exports = Sprite3D;

function Sprite3D() {
    this.data = {
        sheet: null, // Must be defined
        sheetX: 0,
        sheetY: 0,
        sheetW: 0, // Must be more than 0
        sheetH: 0, // Must be more than 0
        dox: 0, // Canvas draw offset
        doy: 0,
        dx: 0, // Base canvas draw position
        dy: 0,
        fdx: 0, // Final canvas draw position (dx + dox)
        fdy: 0
    };
}