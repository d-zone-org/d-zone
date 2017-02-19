'use strict';
var EventEmitter = require('events').EventEmitter;

var events = new EventEmitter();
var mouseX, mouseY, mouseOut;

function onMouseMove(e) {
    e = e.data.originalEvent;
    if(mouseOut) return;
    mouseX = e.pageX;
    mouseY = e.pageY;
    events.emit('mouse-move', { buttons: e.buttons, x: mouseX, y: mouseY });
}

const BUTTONS = ['left','middle','right'];

function onMouseDown(e) {
    e = e.data.originalEvent;
    events.emit('mouse-down', { button: BUTTONS[e.button], x: mouseX, y: mouseY, e });
}

function onMouseUp(e) {
    e = e.data.originalEvent;
    events.emit('mouse-up', { button: BUTTONS[e.button], x: mouseX, y: mouseY, e });
}

function onMouseOut(e) {
    e = e.data.originalEvent;
    mouseOut = true;
    mouseX = e.pageX;
    mouseY = e.pageY;
    events.emit('mouse-out', { button: BUTTONS[e.button], x: mouseX, y: mouseY, e });
}

function onMouseOver(e) {
    e = e.data.originalEvent;
    mouseOut = false;
    mouseX = e.pageX;
    mouseY = e.pageY;
    var buttonNumber = e.buttons & 1 ? 0 : e.buttons & 2 ? 1 : e.buttons & 4 ? 2 : -1;
    events.emit('mouse-over', { button: BUTTONS[buttonNumber], x: mouseX, y: mouseY, e });
}

function onMouseWheel(e) {
    if(!e.deltaY) return;
    events.emit('mouse-wheel', { direction: e.deltaY > 0 ? 'down' : 'up', x: mouseX, y: mouseY, e });
}

function onTouchStart(e) {
    e = e.data.originalEvent;
    mouseX = e.touches[0].pageX;
    mouseY = e.touches[0].pageY;
    this.emit('mouse-down', { button: 'left', x: mouseX, y: mouseY, e });
}

function onTouchMove(e) {
    e = e.data.originalEvent;
    mouseX = e.changedTouches[0].pageX;
    mouseY = e.changedTouches[0].pageY;
    this.emit('mouse-move', { x: mouseX, y: mouseY, e });
}

function onTouchEnd(e) {
    e = e.data.originalEvent;
    events.emit('mouse-up', { button: 'left', x: mouseX, y: mouseY, e });
}

module.exports = {
    init(uiContainer) {
        uiContainer.interactive = true;
        // Mouse events
        uiContainer.on('mousemove', onMouseMove);
        uiContainer.on('mousedown', onMouseDown);
        uiContainer.on('mouseup', onMouseUp);
        uiContainer.on('mouseupoutside', onMouseUp);
        uiContainer.on('mouseout', onMouseOut);
        uiContainer.on('mouseover', onMouseOver);
        var wheelSupport = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
        window.addEventListener(wheelSupport, onMouseWheel);
        // Touch events
        uiContainer.on('touchstart', onTouchStart);
        uiContainer.on('touchmove', onTouchMove);
        uiContainer.on('touchend', onTouchEnd);
        uiContainer.on('touchendoutside', onTouchEnd);
    },
    events: events
};

// Debug
var realWindow = window.parent || window;
realWindow.addEventListener('keydown', function(e) {
    var key = e.keyCode >= 48 && e.keyCode <= 90 ?
        String.fromCharCode(parseInt(e.keyCode)).toLowerCase() : KEYCODES[e.keyCode];
    global.dz.events.emit('key-' + key);
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
    221: "closebracket",
    222: "singlequote"
};