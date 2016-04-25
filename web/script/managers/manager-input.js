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