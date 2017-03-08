'use strict';
var util = require('dz-util');
var UIManager = require('./../manager');
var ViewManager = require('man-view');

var ui = UIManager.ui;
var view = ViewManager.view;
view.events.on('view-change', onViewChange);

var bubbles = [];

module.exports = {
    addBubble(bubble) {
        bubbles.push(bubble);
        onViewChange();
    },
    removeBubble(bubble) {
        util.removeFromArray(bubble, bubbles);
    }
};

function onViewChange() {
    var scaleRatio = view.scale / ui.scale;
    for(var i = 0; i < bubbles.length; i++) {
        bubbles[i].updatePosition(scaleRatio, ui, view)
    }
}