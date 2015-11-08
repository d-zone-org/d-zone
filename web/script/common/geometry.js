'use strict';
var util = require('./util.js');
module.exports = {
    DIRECTIONS: {
        north: { x: 0, y: -1 },
        east: { x: 1, y: 0 },
        south: { x: 0, y: 1 },
        west: { x: -1, y: 0 }
    },
    randomDirection: function() {
        return this.DIRECTIONS[util.pickInObject(this.DIRECTIONS)];
    },
    intervalOverlaps: function(a1,a2,b1,b2) {
        return a1 >= b1 && a1 < b2 || b1 >= a1 && b1 < a2;
    }
};