'use strict';
var BetterCanvas = require('./../common/bettercanvas.js');

var charSets = {
    upper: { y: 0, height: 8, xSpacing: 1, chars: [
        ['A',5], ['B',5], ['C',5], ['D',5], ['E',4], ['F',4], ['G',5], ['H',5], ['I',3], ['J',5],
        ['K',5], ['L',4], ['M',5], ['N',5], ['O',5], ['P',5], ['Q',5], ['R',5], ['S',5], ['T',5],
        ['U',5], ['V',5], ['W',5], ['X',5], ['Y',5], ['Z',5]
    ] },
    lower: { y: 8, height: 11, xSpacing: 1, chars: [
        ['a',5], ['b',4], ['c',4], ['d',4], ['e',4], ['f',4], ['g',4], ['h',4], ['i',1], ['j',2],
        ['k',4], ['l',1], ['m',5], ['n',4], ['o',4], ['p',4], ['q',4], ['r',4], ['s',4], ['t',4],
        ['u',4], ['v',5], ['w',5], ['x',4], ['y',4], ['z',4], [' ',4]
    ] },
    numsAndSymbols: { y: 19, xSpacing: 1, height: 8, chars: [
        ['0',4], ['1',3], ['2',4], ['3',4], ['4',4], ['5',4], ['6',4], ['7',4], ['8',4], ['9',4],
        ['`',2],['~',6],['!',1],['@',7],['#',7],['$',4],['%',5],['^',5],['&',6],['*',3],['(',2],
        [')',2],['_',5],['=',5],['-',5],['+',5],['|',1],[',',2],['.',1],['<',5],['>',5],['?',4],
        ['/',3],['\\',3],[';',1],[':',1],["'",1],['"',3],['[',2],[']',2],['{',3],['}',3]
    ] },
    icons: { count: 4, y: 27, height: 12, chars: [
        [':icon-npm:',12],[':icon-github:',12],[':icon-lock:',12],[':icon-lock-small:',12]
    ] },
    swedish: { count: 6, y: 39, xSpacing: 1, height: 10, oy: -2, chars: [
        ['Å',5],['Ä',5],['Ö',5],['å',5],['ä',5],['ö',4]
    ] }
};

var fontMap = {};

for(var csKey in charSets) { if(!charSets.hasOwnProperty(csKey)) continue;
    var charSet = charSets[csKey], rx = 0;
    for(var c = 0; c < charSet.chars.length; c++) {
        var char = charSet.chars[c][0], width = charSet.chars[c][1]+(charSet.xSpacing || 0);
        fontMap[char] = { x: rx, y: charSet.y, w: width, h: charSet.height, char: char, oy: charSet.oy };
        rx += width;
    }
}
var padding = { x: 4, y: 3 };
var vertOffset = 1;
var image;

module.exports = {
    loadImage: function(img) { image = img; },
    blot: function(options) {
        var x = options.x || 0, y = options.y || 0;
        var metrics = options.metrics || this.calculateMetrics(options);
        var lineStart = options.lineStart ? options.lineStart : 0;
        var lineCount = options.lineCount ? Math.min(metrics.lines.length, options.lineCount) 
            : metrics.lines.length;
        var canvas = options.canvas || new BetterCanvas(
                padding.x * 2 + x + metrics.w - 1,
                padding.y * 2 + y + lineCount * 10
            );
        if(options.bg) canvas.fill(options.bg);
        var charCount = 0;
        for(var l = lineStart; l < Math.min(metrics.lines.length, lineStart + lineCount); l++) {
            var maxChars = metrics.lines[l].chars.length;
            if(options.maxChars) maxChars = Math.min(maxChars,options.maxChars - charCount);
            for(var c = 0; c < maxChars; c++) {
                var char = metrics.lines[l].chars[c];
                if(char.char.text == ' ') continue;
                canvas.drawImage(image, char.char.x, char.char.y, char.w, char.char.h,
                    padding.x + x + char.x, padding.y + y + (l - lineStart) * 10 + (char.oy || 0) + vertOffset, 
                    char.w, char.char.h);
            }
            charCount += metrics.lines[l].chars.length;
        }
        return canvas.canvas;
    },
    transition: function(options) {
        var metrics = options.metrics || this.calculateMetrics(options);
        var canvas = options.canvas || new BetterCanvas(
                metrics.w + padding.x * 2, 
                (options.lineCount || metrics.lines.length) * 10 + padding.y * 2
            );
        var fillWidth = Math.max(2,Math.max(0, options.progress - 0.25) / 0.75 * canvas.canvas.width);
        var fillHeight = Math.min(1, options.progress * 4) * canvas.canvas.height * -1;
        canvas.fillRect(options.bg, (canvas.canvas.width - fillWidth) / 2, canvas.canvas.height, 
            fillWidth, fillHeight);
        return canvas.canvas;
    },
    calculateMetrics: function(options) {
        // TODO: Normalize line lengths so there are no single-word remainders
        var text = options.text;
        var lines = [];
        var words = text.split(' ');
        var space = fontMap[' '];
        var lineWidth = 0, lineChars = [], maxLineWidth = 0;
        for(var w = 0; w < words.length; w++) {
            var word = words[w];
            if(word == '') continue; // Skip empty words
            var wordWidth = 0;
            var wordChars = [];
            if(lineChars.length > 0) { // Add space before word unless starting a line
                wordChars.push({ x: lineWidth, char: space, w: space.w });
                wordWidth += space.w;
            }
            if(word.length > 1 && fontMap[word]) { // Icon codes
                wordChars.push({ 
                    x: lineWidth + wordWidth, char: fontMap[word], w: fontMap[word].w, oy: -2 
                });
                wordWidth += fontMap[word].w;
            } else {
                for(var a = 0; a < word.length; a++) {
                    var ltr = fontMap[word[a]] || space;
                    wordChars.push({ 
                        x: lineWidth + wordWidth, char: ltr, w: ltr.w, oy: ltr.oy 
                    });
                    wordWidth += ltr.w;
                }
            }
            if(options.maxWidth && lineWidth + wordWidth > options.maxWidth) {
                if(wordWidth > options.maxWidth) { // Word is longer than maxWidth, won't fit any line
                    if(lineWidth > 0) {
                        lines.push({ w: lineWidth, chars: lineChars });
                        maxLineWidth = Math.max(lineWidth, maxLineWidth);
                        lineWidth = 0; lineChars = [];
                    }
                    wordChars = [];
                    wordWidth = 0;
                    for(var b = 0; b < word.length; b++) {
                        var ltrB = fontMap[word[b]] || space;
                        if(lineWidth + wordWidth + ltrB.w < options.maxWidth) {
                            wordChars.push({ 
                                x: lineWidth + wordWidth, char: ltrB, w: ltrB.w, oy: ltrB.oy 
                            });
                            wordWidth += ltrB.w;
                        } else {
                            var trimWidth = (lineWidth + wordWidth + ltrB.w) - options.maxWidth;
                            wordChars.push({ 
                                x: lineWidth + wordWidth, char: ltrB, w: ltrB.w - trimWidth, oy: ltrB.oy 
                            });
                            wordWidth += ltrB.w - trimWidth;
                            break;
                        }
                    }
                    lineWidth += wordWidth;
                    lineChars = lineChars.concat(wordChars);
                } else { // Word can be pushed to next line
                    w--;
                }
                lines.push({ w: lineWidth, chars: lineChars });
                maxLineWidth = Math.max(lineWidth, maxLineWidth);
                lineWidth = 0; lineChars = [];
            } else { // Word fits on line
                lineWidth += wordWidth;
                lineChars = lineChars.concat(wordChars);
                if(w == words.length - 1) {
                    lines.push({ w: lineWidth, chars: lineChars });
                    maxLineWidth = Math.max(lineWidth, maxLineWidth);
                }
            }
        }
        return { lines: lines, text: text, w: maxLineWidth };
    },
    fontMap: fontMap
};