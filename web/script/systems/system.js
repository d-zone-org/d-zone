'use strict';

module.exports = System;

function System(name, components) {
    this.name = name;
    this.components = components;
}

System.prototype.init = function(entities, componentData) {
    this.entities = entities;
    if(componentData) this.componentData = componentData;
};

System.prototype.update = function() {
    if(!this.entities) {
        console.error('System',this.name,'trying to update before initialization');
        return;
    }
    for(var e = 0; e < this.entities.length; e++) {
        this.updateEntity(this.entities[e]);
    }
};

System.prototype.updateEntity = function(entity) {
    // Virtual
};

System.prototype.onEntityAdded = function() {
    // Virtual
};

System.prototype.onEntityRemoved = function() {
    // Virtual
};