'use strict';

module.exports = Users;

function Users(game,world) {
    this.game = game;
    this.world = world;
    
    this.actors = {};
}

Users.prototype.addActor = function(actor) {
    var grid = this.world.randomEmptyGrid();
    actor.position = {
        x: grid.x * this.world.gridSize,
        y: grid.y * this.world.gridSize,
        z: this.world.map[grid.x+':'+grid.y].size.z
    };
    this.actors[actor.uid] = actor;
};

Users.prototype.removeActor = function(actor) {
    delete this.actors[actor.uid];
    actor.remove();
};