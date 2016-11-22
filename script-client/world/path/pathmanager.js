'use strict';

var collisionMap, width, height;
var pathJobs = [], jobID = 0; // Track current pathfinding jobs, indexed by entity ID

var pathWorker = require('worker!./pathworker.js'); // Pathfinding webworker
var pathing = new pathWorker(); // One worker instance will handle all pathfinding
pathing.addEventListener('message', function(event) {
    var job = pathJobs[event.data[1]];
    if(job.id !== event.data[0]) return; // Outdated path job
    job.cb(event.data[2]);
    delete pathJobs[event.data[1]];
});

module.exports = {
    init(c) {
        collisionMap = c;
        width = collisionMap.width;
        height = collisionMap.height;
        pathing.postMessage([width, height]);
    },
    getPath(e, sx, sy, sz, dx, dy, dz, maxDown, maxUp, cb) {
        var job = {
            e, id: ++jobID, collision: collisionMap.buffer,
            sx, sy, sz, dx, dy, dz, maxDown, maxUp
        };
        pathJobs[e] = { id: job.id, cb };
        pathing.postMessage(job);
    }
};