'use strict';
var ComponentManager = require('man-component');

var entities = new Uint32Array(64); // Component bit masks

module.exports = {
    addEntity: function(components) {
        var id = newEntityID();
        for(var i = 0; i < components.length; i++) {
            addComponent(id, components[i][0], components[i][1]);
        }
    },
    removeEntity: function(e) {
        ComponentManager.removeEntity(e,entities[e]);
        entities[e] = 0; // Clear component mask
    },
    removeComponent: removeComponent
};

function addComponent(e, component, data) {
    entities[e] |= ComponentManager.getComponentMask([component]); // Update component mask
    ComponentManager.newComponent(e, entities[e], component, data);
}

function removeComponent(e, component) {
    ComponentManager.removeEntity(e, entities[e]);
    entities[e] ^= ComponentManager.getComponentMask([component]); // Update component mask
}

function newEntityID() {
    for(var i = 0; i < entities.length; i++) {
        if(!entities[i]) {
            return i;
        }
    }
    // If no empty entities found, expand entity pool
    expandEntityPool();
    return i; // Return first new index
}

function expandEntityPool() {
    var newPool = new Uint32Array(entities.length * 2); // Double the array length
    newPool.set(entities);
    entities = newPool;
}

// Debug
window.dz.events.on('key-a', function() {
    addComponent(0, require('com-animation'), {
        loop: false,
        rate: 2,
        frames: 13,
        frame: 0,
        originX: 0,
        originY: 56,
        frameW: 35,
        frameH: 27,
        deltaX: 1,
        deltaY: 0,
        offsetX: -7,
        offsetY: -4
    });
});