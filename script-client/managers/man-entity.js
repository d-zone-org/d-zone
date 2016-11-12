'use strict';
var ComponentManager = require('man-component');

var entities = new Uint32Array(64); // Component bit masks

module.exports = {
    addEntity: function(components) {
        var id = newEntityID();
        for(var i = 0; i < components.length; i++) {
            addComponent(id, components[i][0], components[i][1]); // Entity ID, component object, component data
        }
        return id;
    },
    removeEntity: function(e) {
        entities[e] = 0; // Clear component mask
        ComponentManager.removeEntity(e);
    },
    addComponent: addComponent,
    removeComponent: removeComponent,
    hasComponent: function(e, component) {
        return (entities[e] & ComponentManager.getComponentMask([component])) !== 0;
    }
};

function addComponent(e, component, data) {
    entities[e] |= ComponentManager.getComponentMask([component]); // Update component mask
    ComponentManager.newComponent(e, entities[e], component, data);
}

function removeComponent(e, component) {
    entities[e] &= ~ComponentManager.getComponentMask([component]); // Update component mask
    ComponentManager.removeComponent(e, component);
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