'use strict';
var util = require('dz-util');
var UIManager = require('./../manager');
var ViewManager = require('man-view');

var ui = UIManager.ui;
var view = ViewManager.view;
view.events.on('view-change', onViewChange);

var bubbles = [];
const PAD = 6;

module.exports = {
    addBubble(bubble) {
        bubbles.push(bubble);
        onViewChange();
    },
    removeBubble(bubble) {
        util.removeFromArray(bubble, bubbles);
        onViewChange();
    }
};

function onViewChange() {
    var scaleRatio = view.scale / ui.scale;
    for(var i = 0; i < bubbles.length; i++) {
        let thisBub = bubbles[i];
        thisBub.x = Math.floor(scaleRatio * (thisBub.gx - view.panX + view.originX) - thisBub.bubbleWidth / 2);
        thisBub.y = Math.floor(scaleRatio * (thisBub.gy - view.panY + view.originY - 6) - thisBub.bubbleHeight - 6);
        thisBub.x = Math.max(PAD, Math.min(ui.width - thisBub.bubbleWidth - PAD, thisBub.x));
        thisBub.y = Math.max(PAD, Math.min(ui.height - thisBub.bubbleHeight - PAD, thisBub.y));
        for(var p = 0; p < i; p++) {
            // Avoid other bubbles
            if(bubblesCollide(thisBub, bubbles[p])) {
                // TODO: Slide bubble around 4 possible orientations
                // Once a position is found, keep it even after blocking bubble disappears
                // Only screen edge can cause a change
                let moveDist = 1;
                let moveDir = 0;
                while(moveDist < ui.width || moveDist < ui.height) {
                    let proxy = { x: thisBub.x, y: thisBub.y, width: thisBub.width, height: thisBub.height };
                    if(moveDir % 2 === 0) {
                        proxy.y += moveDist * (moveDir === 0 ? 1 : -1);
                    } else {
                        proxy.x += moveDist * (moveDir === 1 ? 1 : -1);
                    }
                    if(inBounds(proxy)) {
                        let invalidPosition = false;
                        for(var q = 0; q < i; q++) {
                            if(bubblesCollide(proxy, bubbles[q])) {
                                invalidPosition = true;
                                break;
                            }
                        }
                        if(!invalidPosition) {
                            thisBub.x = proxy.x;
                            thisBub.y = proxy.y;
                            break;
                        }
                    }
                    moveDir = moveDir === 3 ? 0 : moveDir + 1;
                    if(moveDir === 0) moveDist++;
                }
                break;
            }
        }
    }
}

function inBounds(b) {
    return b.x >= PAD && b.y >= PAD && b.x + b.width + PAD < ui.width && b.y + b.height + PAD < ui.height;
}

function bubblesCollide(b1, b2) {
    return b1.x <= b2.x + b2.width && b1.x + b1.width >= b2.x && b1.y <= b2.y + b2.height && b1.y + b1.height >= b2.y;
}