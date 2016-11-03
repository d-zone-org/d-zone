'use strict';
var EventEmitter = require('events').EventEmitter;

var events = new EventEmitter();
var mouseX, mouseY, mouseLeft, mouseRight, mouseMiddle, mouseOut;

// Mouse events
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
document.addEventListener('mouseout', onMouseOut);
document.addEventListener('mouseover', onMouseOver);
var wheelSupport = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
window.addEventListener(wheelSupport, onMouseWheel);

// Touch events
window.addEventListener('touchstart', onTouchStart);
window.addEventListener('touchmove', onTouchMove);
window.addEventListener('touchend', onTouchEnd);
window.addEventListener('touchcancel', onTouchEnd);

function onMouseMove(e) {
    if(mouseOut) return;
    mouseX = e.pageX;
    mouseY = e.pageY;
    events.emit('mouse-move', { buttons: e.buttons, x: mouseX, y: mouseY });
}

const BUTTONS = ['left','middle','right'];

function onMouseDown(e) {
    switch(BUTTONS[e.button]) {
        case 'left': mouseLeft = true; break;
        case 'right': mouseRight = true; break;
        case 'middle': mouseMiddle = true; break;
    }
    events.emit('mouse-down', { button: BUTTONS[e.button], x: mouseX, y: mouseY });
}

function onMouseUp(e) {
    switch(BUTTONS[e.button]) {
        case 'left': mouseLeft = false; break;
        case 'right': mouseRight = false; break;
        case 'middle': mouseMiddle = false; break;
    }
    events.emit('mouse-up', { button: BUTTONS[e.button], x: mouseX, y: mouseY });
}

function onMouseOut(e) {
    mouseOut = true;
    mouseX = e.pageX;
    mouseY = e.pageY;
    events.emit('mouse-out', { button: BUTTONS[e.button], x: mouseX, y: mouseY });
}

function onMouseOver(e) {
    mouseOut = false;
    mouseX = e.pageX;
    mouseY = e.pageY;
    var buttonNumber = e.buttons & 1 ? 0 : e.buttons & 2 ? 1 : e.buttons & 4 ? 2 : -1;
    events.emit('mouse-over', { button: BUTTONS[buttonNumber], x: mouseX, y: mouseY });
}

function onMouseWheel(e) {
    if(!e.deltaY) return;
    events.emit('mouse-wheel', { direction: e.deltaY > 0 ? 'down' : 'up', x: mouseX, y: mouseY });
}

function onTouchStart(e) {
    mouseLeft = true;
    mouseX = e.touches[0].pageX;
    mouseY = e.touches[0].pageY;
    this.emit('mouse-down', { button: 'left', x: mouseX, y: mouseY });
}

function onTouchMove(e) {
    mouseX = e.changedTouches[0].pageX;
    mouseY = e.changedTouches[0].pageY;
    this.emit('mouse-move', { x: mouseX, y: mouseY });
}

function onTouchEnd(e) {
    mouseLeft = false;
    events.emit('mouse-up', { button: 'left', x: mouseX, y: mouseY });
}

module.exports = {
    events: events
};

// Debug
document.addEventListener('keydown', function(e) {
    var key = e.keyCode >= 48 && e.keyCode <= 90 ?
        String.fromCharCode(parseInt(e.keyCode)).toLowerCase() : KEYCODES[e.keyCode];
    window.dz.events.emit('key-' + key);
});

const KEYCODES = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    45: "insert",
    46: "delete",
    8: "backspace",
    9: "tab",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    19: "pause",
    20: "capslock",
    27: "escape",
    32: "space",
    33: "pageup",
    34: "pagedown",
    35: "end",
    36: "home",
    112: "f1",
    113: "f2",
    114: "f3",
    115: "f4",
    116: "f5",
    117: "f6",
    118: "f7",
    119: "f8",
    120: "f9",
    121: "f10",
    122: "f11",
    123: "f12",
    144: "numlock",
    145: "scrolllock",
    186: "semicolon",
    187: "equal",
    188: "comma",
    189: "dash",
    190: "period",
    191: "slash",
    192: "graveaccent",
    219: "openbracket",
    220: "backslash",
    221: "closebraket",
    222: "singlequote"
};