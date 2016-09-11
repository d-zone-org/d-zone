'use strict';
var ComponentManager = require('manager-component');

var entities = new Uint32Array(64); // Component bit masks

module.exports = {
    addEntity: function() {
        // Get first empty entity
        for(var i = 0; i < entities.length; i++) {
            if(!entities[i]) {
                return i;
            }
        }
        // If no empty entities found, expand entity pool
        expandEntityPool();
        return i; // Return first new index
    },
    removeEntity: function(e) {
        ComponentManager.removeEntity(e,entities[e]);
        entities[e] = 0; // Clear component mask
    },
    addComponent: function(e,component,data) {
        entities[e] |= ComponentManager.getComponentMask([component]); // Update component mask
        ComponentManager.newComponent(e,entities[e],component,data);
    },
    removeComponent: function(e,component) {
        ComponentManager.removeEntity(e,entities[e]);
        entities[e] ^= ComponentManager.getComponentMask([component]); // Update component mask
    }
};

function expandEntityPool() {
    var newPool = new Uint32Array(entities.length*2); // Double the array length
    newPool.set(entities);
    entities = newPool;
}