'use strict';

const C = {
    black: '#000000',
    darkest: '#1D171F',
    dimBrown: '#382D34',
    dimGrey: '#786969',
    grey: '#9E908F',
    lightGrey: '#BAB0A8',
    brightGrey: '#D4D0B9',
    offWhite: '#F5F0D5',
    blurple: '#7B8FCE',
    white: '#FFFFFF'
};

for(var key in C) { // Convert hex strings to actual numbers
    if(!C.hasOwnProperty(key)) continue;
    C[key] = parseInt(C[key].substr(1, 6), 16);
}

module.exports = {
    button: {
        normal: {
            alpha: 0.75,
            border: C.offWhite,
            fill: C.darkest,
            text: C.white
        }
        ,
        hover: {
            alpha: 1,
            border: C.white,
            fill: C.dimBrown,
            text: C.white
        }
        ,
        click: {
            alpha: 1,
            border: C.offWhite,
            fill: C.black,
            text: C.grey
        }
    },
    bubble: {
        fillAlpha: 0.8,
        textAlpha: 0.95,
        fill: C.black,
        text: C.white
    }
};