'use strict';

module.exports = Pathfinder;

function Pathfinder(options) {
    
}

var calcH = function(a,b) {
    var x = Math.abs(a.x - b.x), y = Math.abs(a.y - b.y);
    if(x > y) return 8*y+5*x; else return 8*x+5*y;
};

var getBest = function(list) {
    var best;
    for(var key in list) { if(!list.hasOwnProperty(key)) continue;
        if(!best || best.f > list[key].f) best = list[key];
    }
    return best;
};

var constructPath = function(start,current,closed) {
    var path = []; var cur = current;
    while(true) {
        if(cur.x == start.x && cur.y == start.y) break;
        path.push({x:cur.x,y:cur.y});
        cur = closed[cur.parent];
    }
    return path.reverse();
};