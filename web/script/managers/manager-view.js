'use strict';
var InputManager = require('./manager-input');
var CanvasManager = require('./manager-canvas');
var UIManager = require('./manager-ui');
var util = require('./../common/util.js');

var view = {
    scale: 1,
    width: 1,
    height: 1,
    cursorX: 0,
    cursorY: 0,
    panX: 0,
    panY: 0
};

var panFrom = false;

var viewManager = {
    init: function(options) {
        view.maxScale = options.maxScale;
        view.id = options.id;
        CanvasManager.init(view);
        zoom(options.initialScale - view.scale);
        resize();
        CanvasManager.setSize(window.innerWidth, window.innerHeight);
    },
    view: view
};

InputManager.events.on('mouse-move',function (event) {
    view.cursorX = Math.floor(event.x / view.scale);
    view.cursorY = Math.floor(event.y / view.scale);
    if(!UIManager.mouseMove(view.cursorX, view.cursorY)) {
        panMove();
    }
});
InputManager.events.on('mouse-down',function (event) {
    if(!UIManager.mouseDown(view.cursorX, view.cursorY, event.button)) {
        panStart();
    }
});
InputManager.events.on('mouse-up',function (event) {
    if(!UIManager.mouseUp(view.cursorX, view.cursorY, event.button)) {
        panStop();
    }
});
InputManager.events.on('mouse-wheel',function (event) {
    if(!UIManager.mouseWheel(view.cursorX, view.cursorY, event.direction)) {
        zoom(event.direction == 'up' ? 1 : -1);
    }
});

function panStart() {
    if(panFrom) return;
    panFrom = { x: view.cursorX, y: view.cursorY };
    console.log('pan start', panFrom.x, panFrom.y);
}

function panMove() {
    if(!panFrom) return;
    view.panX += view.cursorX - panFrom.x;
    view.panY += view.cursorY - panFrom.y;
    panFrom = { x: view.cursorX, y: view.cursorY };
    // console.log('pan to', view.panX, view.panY);
}

function panStop() {
    panFrom = false;
    console.log('pan stop');
}

function zoom(change) {
    if(view.scale + change < 1 || view.scale + change > view.maxScale) return;
    view.scale += change;
    console.log('zoom to', view.scale);
    // console.log('panning',Math.round(x - (canvas.width / 2)) * levelChange,
    //     Math.round(y - (canvas.height / 2)) * levelChange);
    // pan.x -= Math.round(x - (canvas.width / 2)) * change;
    // pan.y -= Math.round(y - (canvas.height / 2)) * change;
    CanvasManager.setZoom(view.scale);
    resize();
}

function resize() {
    view.width = Math.ceil(window.innerWidth / (view.scale));
    view.height = Math.ceil(window.innerHeight / (view.scale));
}

window.addEventListener('resize', function() {
    resize();
    CanvasManager.setSize(window.innerWidth, window.innerHeight);
});

module.exports = viewManager;