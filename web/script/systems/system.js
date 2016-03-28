'use strict';

module.exports = System;

function System(name, components) {
    this.systemName = name;
    this.components = components;
}

System.prototype.init = function(entities, componentData) {
    this.entities = entities;
    this.componentData = componentData;
};

System.prototype.update = function() {
    var e, c, entity, dataArgs;
    for(e = 0; e < this.entities.length; e++) {
        entity = this.entities[e];
        dataArgs = [entity];
        for(c = 0; c < this.components.length; c++) {
            dataArgs.push(this.componentData[c][entity]);
        }
        this.updateEntity.apply(this,dataArgs);
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