'use strict';
var SpriteManager = require('man-sprite');
var Canvas = require('canvas');

const padX = 4, padY = 3;
const CHARS = {
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

var fontMap = {};

/*
 TODO: Store each component in its own array
 Key is array of chars, used to get index for other arrays
 */

for(var csKey in CHARS) {
    if(!CHARS.hasOwnProperty(csKey)) continue;
    var charSet = CHARS[csKey], 
        cx = 0, cy = charSet.y;
    for(var c = 0; c < charSet.chars.length; c++) {
        var char = charSet.chars[c][0], 
            width = charSet.chars[c][1] + (charSet.xSpacing || 0);
        fontMap[char] = { x: cx, y: cy, w: width, h: charSet.height, char: char, oy: charSet.oy };
        cx += width;
    }
}