'use strict';
// Runs the game loop which calls systems to update

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

function updateSystems() {
    if(!systems) return;
    //var timeThis = (ticks & 255) == 0;
    //if(timeThis) console.time('update');
    for(s = 0; s < systems.length; s++) {
        systems[s].update();
    }
    //if(timeThis) console.timeEnd('update');
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

window.pause = function() { paused = !paused; };

module.exports = {
    init: function(s) {
        systems = s;
        gameLoop = setInterval(interval, step);
    }
};