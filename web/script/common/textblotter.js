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
fontMap[':icon-npm:'] = { x: 0, y: 27, w: 12, h: 12 };
fontMap[':icon-github:'] = { x: 12, y: 27, w: 12, h: 12 };
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
        var metrics = this.calculateMetrics(options);
        var canvas = options.canvas || new BetterCanvas(metrics.w + padding.x * 2, metrics.h + padding.y * 2);
        var fillWidth = Math.max(2,Math.max(0, options.progress - 0.25) / 0.75 * canvas.canvas.width);
        var fillHeight = Math.min(1, options.progress * 4) * canvas.canvas.height * -1;
        canvas.fillRect(options.bg, (canvas.canvas.width - fillWidth) / 2, canvas.canvas.height, 
            fillWidth, fillHeight);
        return canvas.canvas;
    },
    calculateMetrics: function(options) {
        // TODO: Normalize line lengths so there are no single-word remainders
        var text = options.text;
        var runningWidth = 0, runningHeight = 10, totalWidth = 0, 
            lineNumber = 1, charMap = [], lines = [];
        var words = text.split(' ');
        var currentLine = '';
        for(var w = 0; w < words.length; w++) {
            var includeLine = !options.hasOwnProperty('lineNumber')
                || (lineNumber >= options.lineNumber && lineNumber < options.lineNumber+options.maxLines);
            var word = words[w];
            var wordWidth = 0;
            if(word.substr(0,6) == ':icon-' && fontMap[word]) {
                wordWidth = fontMap[word].w;
            } else {
                for(var a = 0; a < word.length; a++) {
                    var ltr = fontMap[word[a]] ? fontMap[word[a]] : fontMap[' '];
                    wordWidth += ltr.w;
                }
            }
            if(options.maxWidth && runningWidth + wordWidth > options.maxWidth) {
                if(wordWidth <= options.maxWidth) {
                    // Remove trailing space
                    if(charMap.length > 0 && charMap[charMap.length-1].char == ' ') charMap.pop();
                    runningWidth -= fontMap[' '].w;
                    runningWidth = 0;
                    if(includeLine) {
                        runningHeight += 10;
                        // Filter out icon codes (clean this up!)
                        currentLine = currentLine.split(':icon-github:').join('_').split(':icon-npm').join('_');
                        lines.push(currentLine.trim());
                    }
                    lineNumber++;
                    currentLine = '';
                    w--;
                }
            } else {
                currentLine += word + ' ';
                if(word.substr(0,6) == ':icon-' && fontMap[word]) {
                    charMap.push({
                        char: word, ltr: fontMap[word], x: runningWidth, y: runningHeight - 12
                    });
                    runningWidth += fontMap[word].w;
                } else {
                    for(var b = 0; b < word.length; b++) {
                        ltr = fontMap[word[b]] ? fontMap[word[b]] : fontMap[' '];
                        if(includeLine) {
                            charMap.push({
                                char: word[b], ltr: ltr, x: runningWidth, y: runningHeight - 10
                            });
                        }
                        runningWidth += ltr.w;
                    }
                }
                if(includeLine) totalWidth = Math.max(runningWidth, totalWidth);
                ltr = fontMap[' '];
                if(includeLine) charMap.push({
                    char: ' ', ltr: ltr, x: runningWidth, y: runningHeight - 10
                });
                runningWidth += ltr.w;
            }
        }
        if(charMap.length > 0 && charMap[charMap.length-1].char == ' ') charMap.pop(); // Remove final space
        currentLine = currentLine.split(':icon-github:').join('_').split(':icon-npm').join('_');
        if(currentLine != '' && includeLine) lines.push(currentLine.trim());
        return { w: totalWidth-1, h: lines.length * 10, lines: lines, charMap: charMap };
    },
    fontMap: fontMap
};