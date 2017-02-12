'use strict';
const black = '#000000';
const darkest = '#1D171F';
const dimBrown = '#382D34';
const dimGrey = '#786969';
const grey = '#9E908F';
const lightGrey = '#BAB0A8';
const brightGrey = '#D4D0B9';
const offWhite = '#F5F0D5';
const blurple = '#7B8FCE';
const white = '#FFFFFF';

module.exports = {
    button: {
        normal: {
            alpha: 0.75,
            border: offWhite,
            fill: black,
            text: white
        }
        ,
        hover: {
            alpha: 0.95,
            border: white,
            fill: black,
            text: white
        }
        ,
        click: {
            alpha: 1,
            border: grey,
            fill: black,
            text: grey
        }
    },
    bubble: {
        fillAlpha: 0.75,
        textAlpha: 0.95,
        fill: black,
        text: white
    }
};