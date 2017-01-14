'use strict';
var SpriteManager = require('man-sprite');
var Canvas = require('canvas');
var fontSheet;
SpriteManager.waitForLoaded(function() {
    fontSheet = SpriteManager.sheets.font;
});

const padX = 4, padY = 3, lineHeight = 10;
const CHARMAP = {
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
        ['`',2], ['~',6], ['!',1], ['@',7], ['#',7], ['$',4], ['%',5], ['^',5], ['&',6], ['*',3], ['(',2], [')',2],
        ['_',5], ['=',5], ['-',5], ['+',5], ['|',1], [',',2], ['.',1], ['<',5], ['>',5], ['?',4], ['/',3], ['\\',3],
        [';',1], [':',1], ["'",1], ['"',3], ['[',2], [']',2], ['{',3], ['}',3], ['unknown',5]
    ] },
    icons: { count: 4, y: 27, height: 12, chars: [
        [':icon-npm:',12], [':icon-github:',12], [':icon-lock:',12], [':icon-lock-small:',12]
    ] },
    accented1: { y: 39, xSpacing: 1, height: 13, oy: -2, chars: [
        ['á',5], ['Á',5], ['à',5], ['À',5], ['â',5], ['Â',5], ['ä',5], ['Ä',5], ['ã',5], ['Ã',5], ['å',5], ['Å',5],
        ['æ',7], ['Æ',7], ['ç',4], ['Ç',5], ['é',4], ['É',4], ['è',4], ['È',4], ['ê',4], ['Ê',4], ['ë',4], ['Ë',4],
        ['í',2], ['Í',3], ['ì',2], ['Ì',3], ['î',3], ['Î',3], ['ï',3], ['Ï',3]
    ] },
    accented2: { y: 52, xSpacing: 1, height: 10, oy: -2, chars: [
        ['ñ',4], ['Ñ',5], ['ó',4], ['Ó',5], ['ò',4], ['Ò',5], ['ô',4], ['Ô',5], ['ö',4], ['Ö',5],
        ['õ',4], ['Õ',5], ['ø',4], ['Ø',5], ['œ',7], ['Œ',8], ['ß',5], ['ú',4], ['Ú',5], ['ù',4],
        ['Ù',5], ['û',4], ['Û',5], ['ü',4], ['Ü',5]
    ] }
};

var charArr = [], wArr = [], hArr = [], xArr = [], yArr = [], oyArr = [];
var space, unknown;

for(var csKey in CHARMAP) {
    if(!CHARMAP.hasOwnProperty(csKey)) continue;
    var charSet = CHARMAP[csKey], cx = 0;
    for(var c = 0; c < charSet.chars.length; c++) {
        var charIndex = charArr.length;
        charArr.push(charSet.chars[c][0]);
        if(charArr[charIndex] === ' ') space = charIndex;
        else if(charArr[charIndex] === 'unknown') unknown = charIndex;
        wArr.push(charSet.chars[c][1] + (charSet.xSpacing || 0));
        hArr.push(charSet.height);
        xArr.push(cx);
        yArr.push(charSet.y);
        oyArr.push(charSet.oy || 0);
        cx += wArr[charIndex];
    }
}

function getWordMetrics(text) {
    var words = text.split(' ');
    var wordChars = [];
    var wordWidths = [];
    for(var w = 0; w < words.length; w++) {
        var word = words[w];
        var chars = [];
        var width = 0;
        var charIndex = charArr.indexOf(word);
        if(charIndex >= 0) {
            chars.push(charIndex);
            width += wArr[charIndex];
        } else {
            for(var c = 0; c < word.length; c++) {
                charIndex = charArr.indexOf(word[c]);
                if(charIndex < 0) charIndex = unknown;
                chars.push(charIndex);
                width += wArr[charIndex];
            }
        }
        wordChars.push(chars);
        wordWidths.push(width);
    }
    return { wordChars, wordWidths };
}

function getBlotMetrics(wordMetrics, maxWidth, maxHeight) {
    var wordLines = [];
    var lineWidth = 0;
    var line = [];
    for(var w = 0; w < wordMetrics.wordWidths.length; w++) {
        var width = wordMetrics.wordWidths[w];
        if(lineWidth > 0 && lineWidth + width > maxWidth) { // Line too long for next word
            if(wordLines.length * lineHeight > maxHeight) break;
            lineWidth = 0;
            wordLines.push(line);
            line = [];
            w--; // Loop again
        } else { // Add next word to line
            line.push(w);
            lineWidth += width + wArr[space];
        }
    }
    if(lineWidth > 0) wordLines.push(line); // Add final line if not empty
    var charLines = wordLines.map(function(wordLine) { // Convert word arrays to char arrays
        var charLine = wordLine.reduce(function(a, b) {
            return a.concat(wordMetrics.wordChars[b]).concat(space);
        }, []);
        charLine.pop(); // Remove line-ending space
        return charLine;
    });
    var lineWidths = wordLines.map(function(wordLine) { // Get widths of word arrays
        return wordLine.reduce(function(a, b) {
            return a + wordMetrics.wordWidths[b] + wArr[space];
        }, -wArr[space]); // To remove width of line-ending space
    });
    var blottedWidth = Math.max.apply(null, lineWidths);
    var blottedHeight = wordLines.length * lineHeight;
    return { charLines, blottedWidth, blottedHeight };
}

function blotText(params) {
    if(!fontSheet) return;
    var blotMetrics;
    if(params.charLines) blotMetrics = params;
    else {
        var wordMetrics = params.text ? getWordMetrics(params.text) : params;
        blotMetrics = getBlotMetrics(wordMetrics, params.maxWidth, params.maxHeight);
    }
    var canvas = params.canvas || new Canvas(blotMetrics.blottedWidth, blotMetrics.blottedHeight);
    var left = params.x || 0;
    if(params.align === 'center') left +=  Math.floor(params.maxWidth / 2 - (blotMetrics.blottedWidth - 1) / 2);
    for(var l = 0; l < blotMetrics.charLines.length; l++) {
        var caretX = left;
        for(var c = 0; c < blotMetrics.charLines[l].length; c++) {
            var caretY = (params.y || 0) + l * lineHeight;
            var char = blotMetrics.charLines[l][c];
            canvas.drawImage(fontSheet, xArr[char], yArr[char], wArr[char], hArr[char], caretX, caretY + oyArr[char]);
            caretX += wArr[char];
        }
    }
    return canvas.canvas;
}

module.exports = { getWordMetrics, getBlotMetrics, blotText };