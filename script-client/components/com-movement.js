'use strict';

module.exports = Movement;

function Movement() {
    this.data = {
        dx: 0, // Relative destination XYZ, one of these must be non-zero
        dy: 0,
        dz: 0,
        ticks: 1 // Duration
    };
}