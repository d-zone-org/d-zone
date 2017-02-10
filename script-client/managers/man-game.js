'use strict';
var EntityManager = require('./man-entity');

var now = global.performance && global.performance.now ? function() {
    return performance.now()
} : Date.now || function () {
    return +new Date()
};

var gameLoop;
var step = 1000/60;
var lastUpdate = 0;
var dt = 0;
var ticks = 0;
var paused = false;
var crashed = false;

var systems, s;

// var updateTime = 0, tickCount = 0;

function updateSystems() {
    // tickCount++;
    // var updateStart = performance.now();
    for(s = 0; s < systems.length; s++) {
        systems[s].update();
    }
    EntityManager.afterUpdates();
    // updateTime += performance.now() - updateStart;
    // if(tickCount == 500) { tickCount = 0; console.log('avg tick update time',updateTime/500); updateTime = 0; }
}

function interval() {
    if(crashed) return;
    dt += now() - lastUpdate;
    if(lastUpdate > 0 && dt > 60000) {
        console.log('too many updates missed! game crash...');
        crashed = true; paused = true;
    }
    if(dt > step) {
        while(dt >= step) {
            dt -= step;
            if(paused) continue;
            ticks++;
            updateSystems();
        }
    }
    lastUpdate = now();
}

module.exports = {
    init(sys) {
        systems = sys;
        gameLoop = setInterval(interval, step);
    },
    setStep(s) {
        step = 1000/s;
    } 
};