'use strict';
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
    [')',2],['_',5],['=',5],['-',5],['+',5],['|',1],[',',2],['.',1],['<',5],['>',5],['?',4],
    ['/',3],['\\',3],[';',1],[':',1],["'",1],['"',3],['[',2],[']',2],['{',3],['}',3]
];

var fontMap = {}, rx = 0;
for(var m = 0; m < metrics.length; m++) {
    fontMap[metrics[m][0]] = { x: rx, y: (m < 26 ? 0 : m > 52 ? 19 : 8),
        w: metrics[m][1]+1, h: m < 26 ? 8 : m > 52 ? 8 : 11 };
    rx += metrics[m][1]+1;
    if(m == 25 || m == 52) rx = 0;
}
var padding = { x: 4, y: 3 };
var vertOffset = 1;
var image;

module.exports = {
    loadImage: function(img) { image = img; },
    blot: function(options) {
        var x = options.x || 0, y = options.y || 0;
        var metrics = this.calculateMetrics(options);
        var canvas = options.canvas 
            || new BetterCanvas(padding.x * 2 + x + metrics.w, padding.y * 2 + y + metrics.h);
        if(options.bg) canvas.fill(options.bg);
        var charCount = options.charCount ? options.charCount : metrics.charMap.length;
        for(var c = 0; c < charCount; c++) {
            var char = metrics.charMap[c];
            if(char.char == ' ') continue;
            canvas.drawImage(image, char.ltr.x, char.ltr.y, char.ltr.w, char.ltr.h,
                padding.x + x + char.x, padding.y + y + char.y + vertOffset, char.ltr.w, char.ltr.h);
        }
        return canvas.canvas;
    },
    transition: function(options) {
        var canvas = options.canvas || new BetterCanvas(options.w + padding.x * 2, options.h + padding.y * 2);
        var fillWidth = Math.max(2,Math.max(0, options.progress - 0.25) / 0.75 * canvas.canvas.width);
        var fillHeight = Math.min(1, options.progress * 4) * canvas.canvas.height * -1;
        canvas.fillRect(options.bg, (canvas.canvas.width - fillWidth) / 2, canvas.canvas.height, 
            fillWidth, fillHeight);
        return canvas.canvas;
    },
    calculateMetrics: function(options) {
        var text = options.text;
        var runningWidth = 0, runningHeight = 10, totalWidth = 0, lineCount = 1, charMap = [];
        for(var a = 0; a < text.length; a++) {
            var ltr = fontMap[text[a]] ? fontMap[text[a]] : fontMap[' '];
            if(options.maxWidth && runningWidth + ltr.w > options.maxWidth) {
                runningWidth = 0;
                runningHeight += 10;
                lineCount++;
            }
            charMap.push({ char: text[a], ltr: ltr, x: runningWidth, y: runningHeight - 10 });
            if(!(text[a] == ' ' && runningWidth == 0)) { // Don't start line with space
                runningWidth += ltr.w;
            }
            totalWidth = Math.max(runningWidth, totalWidth);
        }
        return { w: totalWidth-1, h: runningHeight, lines: lineCount, charMap: charMap };
    },
    metrics: metrics, fontMap: fontMap
};