'use strict';
var Geometry = require('./../../common/geometry.js');
var util = require('./../../common/util.js');

module.exports = Collect;

function Collect(actor,types) {
    this.actor = actor;
    this.types = types;
    this.boundCheckSurroundings = this.checkSurroundings.bind(this);
    this.actor.on('movecomplete', this.boundCheckSurroundings);
}

Collect.prototype.checkSurroundings = function() {
    // Look at 4 adjacent grids in random order
    var adjacent = Geometry.closestGrids.slice(1,5);
    util.shuffleArray(adjacent);
    for(var a = 0; a < adjacent.length; a++) {
        var adj = { 
            x: this.actor.position.x + adjacent[a][0], 
            y: this.actor.position.y + adjacent[a][1], 
            z: this.actor.position.z
        };
        var object = this.actor.game.world.objectAtXYZ(adj.x,adj.y,adj.z);
        if(object && object.presence == 'offline' && !object.bubble) { // Found offline actor with no bubble
            this.actor.bubble.addItem(object);
            object.remove();
            this.detach();
            break;
        }
    }
};

Collect.prototype.detach = function() {
    this.actor.removeListener('movecomplete', this.boundCheckSurroundings);
    delete this.actor.collect; // Remove behavior
};