'use strict';
var util = require('dz-util');

module.exports = System;

function System(components) {
    this.components = components;
}

System.prototype.init = function(entities, componentData) {
    this.entities = entities;
    this.removeEntities = [];
    this.componentData = componentData;
};

System.prototype.update = function() {
    var e, c, entity, dataArgs, r;
    for(e = 0; e < this.entities.length; e++) {
        entity = this.entities[e];
        dataArgs = [entity];
        for(c = 0; c < this.components.length; c++) {
            dataArgs.push(this.componentData[c][entity]);
        }
        this.updateEntity.apply(this, dataArgs);
    }
    for(r = 0; r < this.removeEntities.length; r++) {
        util.removeFromArray(this.removeEntities[r], this.entities);
    }
    this.removeEntities.length = 0;
};

System.prototype.onEntityRemoved = function(entity) {
    this.removeEntities.push(entity);
};

System.prototype.updateEntity = function(entity) { }; // Virtual

System.prototype.onEntityAdded = function(entity) { }; // Virtual
