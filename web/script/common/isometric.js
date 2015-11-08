'use strict';

module.exports = Isometric;

function Isometric(size) {
    this.size = size;
    this.width = size;
    this.height = size/2;
}

Isometric.prototype.toScreen = function(coords) {
    return {
        x: (coords.x + coords.y) * this.width,
        y: (coords.y - coords.x) * this.height - coords.z
    };
};

Isometric.prototype.toIso = function(screen,height) {
    return {
        x: screen.x / this.width - (screen.y-height) / this.height,
        y: (screen.y-height) / this.height + screen.x / this.width
    };
};