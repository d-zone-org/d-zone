'use strict';
var Geometry = require('./../../common/geometry.js');
var util = require('./../../common/util.js');

module.exports = Collect;

function Collect(actor,types) {
    this.actor = actor;
    this.types = types;
    this.boundCheckSurroundings = this.checkSurroundings.bind(this);
    this.actor.on('move-complete', this.boundCheckSurroundings);
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
        if(!object) continue;
        // Check if found offline actor with no bubble
        if(object.actor && object.actor.presence == 'offline' && !object.actor.bubble 
            && !object.actor.underneath()) { 
            this.actor.bubble.addItem(object.actor);
            object.actor.remove();
            this.detach();
            break;
        }
    }
};

Collect.prototype.detach = function() {
    this.actor.removeListener('move-complete', this.boundCheckSurroundings);
    delete this.actor.collect; // Remove behavior
};