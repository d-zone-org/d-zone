'use strict';

var map;

module.exports = {
    loadMap: function(m) { map = m; },
    findPath: function(options) {
        var start = options.start, end = options.end;
        if(start.x == end.x && start.y == end.y || !(map[end.x+':'+end.y] >= 0)) return [];
        var startH = calcH(end,start);
        var current = { x: start.x, y: start.y, grid: start.x+':'+start.y, g: 0, h: startH, f: startH };
        var startIsCurrent = true;
        var openCount = 0, open = {}, closed = {};
        // Add starting grid to open list
        open[current.grid] = current; openCount++;
        while(openCount > 0) {
            closed[current.grid] = current;
            delete open[current.grid]; openCount--;
            // Check if ending reached
            if(current.x == end.x && current.y == end.y) { return constructPath(start,current,closed); }
            // Add neighbors
            for(var nx = -1; nx <= 1; nx++) { for(var ny = -1; ny <= 1; ny++) {
                // Skip self and diagonals
                if((nx == 0 && ny == 0) || Math.abs(nx)+Math.abs(ny) > 1) continue;
                var neighbor = {
                    parent: current.grid, x: +current.x + nx, y: +current.y + ny,
                    grid: (+current.x + nx) +':'+ (+current.y + ny)
                };
                // If grid is walkable and not closed
                if(map[neighbor.grid] >= 0 && !closed[neighbor.grid]) {
                    // Subtract own height from Z if on starting grid
                    var currentZ = startIsCurrent ? map[current.grid] - 0.5 : map[current.grid];
                    if(Math.abs(currentZ - map[neighbor.grid]) > 0.5) continue;
                    neighbor.g = current.g + 10;
                    neighbor.h = calcH(end,neighbor); neighbor.f = neighbor.g + neighbor.h;
                    var existing = open[neighbor.grid];
                    if(existing) { // If neighbor was already checked
                        if(existing.g > neighbor.g) { // If this G is better
                            existing.g = neighbor.g; existing.f = existing.g + existing.h;
                            existing.parent = current.grid;
                        }
                    } else { // Neighbor is a new square
                        open[neighbor.grid] = neighbor; openCount++;
                    }
                }
            }}
            current = getBest(open);
            startIsCurrent = false;
        }
        return [];
    }
};

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
        path.push({ x: cur.x, y: cur.y, z: map[cur.x+':'+cur.y] });
        cur = closed[cur.parent];
    }
    return path.reverse();
};