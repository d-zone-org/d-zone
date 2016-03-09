'use strict';

module.exports = function() {
    this.name = 'sprite';
    this.data = {
        sheet: null, // Must be defined
        sheetX: 0,
        sheetY: 0,
        sheetW: 0,
        sheetH: 0,
        x: 0,
        y: 0,
        w: 10,
        h: 10,
        color: '#ffffff'
    };
};