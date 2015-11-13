'use strict';
var SpriteSheet = require('./../engine/spritesheet.js');
var BetterCanvas = require('./../common/bettercanvas.js');

var metrics = [
    ['A',5], ['B',5], ['C',5], ['D',5], ['E',4], ['F',4], ['G',5], ['H',5], ['I',3], ['J',5],
    ['K',5], ['L',4], ['M',5], ['N',5], ['O',5], ['P',5], ['Q',5], ['R',5], ['S',5], ['T',5],
    ['U',5], ['V',5], ['W',5], ['X',5], ['Y',5], ['Z',5],
    ['a',5], ['b',4], ['c',4], ['d',4], ['e',4], ['f',4], ['g',4], ['h',4], ['i',1], ['j',2],
    ['k',4], ['l',1], ['m',5], ['n',4], ['o',4], ['p',4], ['q',4], ['r',4], ['s',4], ['t',4],
    ['u',4], ['v',5], ['w',5], ['x',4], ['y',4], ['z',4], [' ',4],
    ['0',4], ['1',3], ['2',4], ['3',4], ['4',4], ['5',4], ['6',4], ['7',4], ['8',4], ['9',4],
    ['`',2],['~',6],['!',1],['@',7],['#',7],['$',4],['%',5],['^',5],['&',6],['*',3],['(',2],
    [')',2],['_',5],['=',5],['-',5],['+',5],['|',1],[',',2],['.',1],['<',5],['>',5],['/',3],
    ['\\',3],[';',1],[':',1],["'",1],['"',3],['[',2],[']',2],['{',3],['}',3]
];

var fontMap = {}, rx = 0;
for(var m = 0; m < metrics.length; m++) {
    fontMap[metrics[m][0]] = { x: rx, y: (m < 26 ? 0 : m > 52 ? 19 : 8),
        w: metrics[m][1]+1, h: m < 26 ? 8 : m > 52 ? 8 : 11 };
    rx += metrics[m][1]+1;
    if(m == 25 || m == 52) rx = 0;
}
var padding = 4;

var image = new SpriteSheet('font.png');
image.setMaxListeners(0);
image.once('loaded',function(canvas) {
    image.img = canvas;
});

module.exports = TextBlotter;

function TextBlotter() {
    
}

TextBlotter.prototype.blot = function(text, canvas, x, y, alignment, bg, fullWidth) {
    if(!image.img) return;
    fullWidth = fullWidth || 0;
    var totalWidth = this.calculateWidth(text);
    canvas = canvas ? canvas : new BetterCanvas((fullWidth || totalWidth) + padding*2, 11 + padding * 1.5);
    var xPos = 0;
    var offset = alignment == 'center' ? Math.floor((totalWidth-1)/2) - fullWidth/2 : 0;
    if(bg) canvas.fill(bg);
    for(var l = 0; l < text.length; l++) {
        var ltr = fontMap[text[l]] ? fontMap[text[l]] : fontMap[' '];
        canvas.drawImage(image.img,ltr.x,ltr.y,ltr.w,ltr.h,padding+x+xPos-offset,padding+y,ltr.w,ltr.h);
        xPos += ltr.w;
    }
    return canvas.canvas;
};

TextBlotter.prototype.transition = function(canvas, bg, fullWidth, progress) {
    canvas = canvas ? canvas : new BetterCanvas(fullWidth + padding*2, 11 + padding * 1.5);
    var fillWidth = Math.max(2,Math.max(0, progress - 0.25) / 0.75 * canvas.canvas.width);
    var fillHeight = Math.min(1, progress * 4) * canvas.canvas.height * -1;
    canvas.fillRect(bg, (canvas.canvas.width - fillWidth) / 2, canvas.canvas.height, fillWidth, fillHeight);
    return canvas.canvas;
};

TextBlotter.prototype.ready = function() {
    return image.img;
};

TextBlotter.prototype.onLoad = function(cb) {
    image.once('loaded',cb);
};

TextBlotter.prototype.calculateWidth = function(text) {
    var totalWidth = 0;
    for(var a = 0; a < text.length; a++) {
        totalWidth += (fontMap[text[a]] ? fontMap[text[a]].w : fontMap[' '].w);
    }
    return totalWidth-1;
};

TextBlotter.prototype.metrics = metrics;