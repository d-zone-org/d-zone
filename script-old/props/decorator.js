'use strict';
var geometry = require('./../common/geometry.js');
var Beacon = require('./../props/beacon.js');
var Seed = require('./../props/seed.js');

module.exports = Decorator;

function Decorator(game, world) {
    this.game = game;
    this.world = world;
    this.createBeacon();
}

Decorator.prototype.sewSeed = function(options) {
    var destination;
    for(var i = 0; i < geometry.closestGrids.length; i++) {
        var close = geometry.closestGrids[i];
        var grid = this.world.map[(options.origin.x+close[0]) + ':' + (options.origin.y+close[1])];
        if(!grid || grid.style == 'plain') continue;
        if(this.world.objectAtXYZ(grid.position.x,grid.position.y,grid.position.z+grid.height)) continue;
        destination = grid.position;
        break;
    }
    if(!destination) return;
    var talkSeed = new Seed({
        origin: options.origin,
        destination: { x: destination.x, y: destination.y, z: destination.z + 0.5 }
    });
    talkSeed.addToGame(self.game);
};

Decorator.prototype.createBeacon = function() {
    //var beaconLocations = {};
    //for(var mKey in this.world.map) { if(!this.world.map.hasOwnProperty(mKey)) continue;
    //    if(this.world.map[mKey].style != 'plain') continue;
    //    var neighbors = geometry.getNeighbors(mKey);
    //    var isPedestal = true;
    //    for(var nKey in neighbors) { if(!neighbors.hasOwnProperty(nKey)) continue;
    //        if(!this.world.map[neighbors[nKey]]
    //            || this.world.map[neighbors[nKey]].position.z + 0.5 != this.world.map[mKey].position.z) {
    //            isPedestal = false; break;
    //        }
    //    }
    //    if(isPedestal) {
    //        beaconLocations = {}; beaconLocations[mKey] = this.world.map[mKey];
    //        break;
    //    } else {
    //        beaconLocations[mKey] = this.world.map[mKey];
    //    }
    //}
    //var beaconLocationKeys = Object.keys(beaconLocations);
    //beaconLocationKeys.sort(function(a,b) {
    //    var xa = Math.abs(a.split(':')[0]), ya = Math.abs(a.split(':')[1]),
    //        xb = Math.abs(b.split(':')[0]), yb = Math.abs(b.split(':')[1]);
    //    return (xa + ya) - (xb + yb);
    //});
    //var beaconLocation = beaconLocations[beaconLocationKeys[0]];
    //beaconLocation.position = { x: 0, y: 0, z: 0 };
    this.beacon = new Beacon(
        0, 0, 0
    );
    this.beacon.addToGame(this.game);
};