'use strict';
var util = require('dz-util');
// Manages component families and data for all entities

var components, systems;
var componentFamilies = [];
var componentData = new Map(); // Component-key map containing entity-indexed arrays of data

module.exports = {
    init(com, sys) {
        components = com;
        for(var c = 0; c < components.length; c++) {
            componentData[components[c]] = [];
            components[c]._mask = 1 << c;
        }
        systems = sys;
        for(var s = 0; s < systems.length; s++) {
            if(!systems[s].components) continue;
            var familyMask = getComponentMask(systems[s].components);
            var componentFamily = false;
            for(var cf = 0; cf < componentFamilies.length; cf++) {
                if(componentFamilies[cf].mask === familyMask) {
                    componentFamily = componentFamilies[cf];
                    break;
                }
            }
            if(!componentFamily) {
                componentFamily = new ComponentFamily(systems[s].components);
                componentFamilies.push(componentFamily);
            }
            componentFamily.addSystem(systems[s]);
        }
    },
    removeEntity(entity) {
        componentData.forEach(function(component) {
            delete component[entity];
        });
        for(var f = 0; f < componentFamilies.length; f++) {
            componentFamilies[f].removeEntity(entity, 0); // Notify all families
        }
    },
    addComponent(entity, mask, component, data) {
        componentData[component][entity] = (new component(data)).data;
        for(var f = 0; f < componentFamilies.length; f++) { // Notify families that require component
            componentFamilies[f].addEntity(entity, mask); // Notify families that match new mask
        }
    },
    removeComponent(entity, component) {
        if(componentData[component][entity].destroy) componentData[component][entity].destroy();
        delete componentData[component][entity]; // Delete component data
        for(var f = 0; f < componentFamilies.length; f++) { // Notify families that require component
            componentFamilies[f].removeEntity(entity, getComponentMask([component]));
        }
    },
    afterUpdates() {
        for(var f = 0; f < componentFamilies.length; f++) {
            componentFamilies[f].afterUpdates();
        }
    },
    getComponentData: getComponentData,
    getComponentMask: getComponentMask,
    componentData: componentData,
    componentFamilies: componentFamilies
};

function getComponentData(family) {
    if(family[0]) {
        var familyData = [];
        for(var c = 0; c < family.length; c++) {
            familyData.push(componentData[family[c]]);
        }
        return familyData;
    } else {
        return componentData[family];
    }
}

function getComponentMask(componentList) {
    var mask = 0;
    for(var i = 0; i < componentList.length; i++) {
        mask |= componentList[i]._mask;
    }
    return mask;
}

// Component family prototype
function ComponentFamily(componentList) {
    this.componentNames = '';
    for(var c = 0; c < componentList.length; c++) {
        this.componentNames += (c == 0 ? '' : '-') + componentList[c].name;
    }
    this.mask = getComponentMask(componentList);
    this.entities = [];
    this.removeEntities = [];
    this.systems = [];
    this.componentData = getComponentData(componentList);
}

ComponentFamily.prototype.addSystem = function(system) {
    this.systems.push(system);
    system.init(this.entities, this.componentData);
};

ComponentFamily.prototype.removeEntity = function(entity, removeMask) {
    if(removeMask > 0 && removeMask !== (removeMask & this.mask)) return; // Ignore if family doesn't match removal
    this.removeEntities.push(entity);
};

ComponentFamily.prototype.addEntity = function(entity, entityMask) {
    if(this.mask !== (this.mask & entityMask)) return; // Ignore if entity doesn't match family
    if(this.entities.includes(entity)) return; // Ignore if entity already in this family
    this.entities.push(entity);
    for(var s = 0; s < this.systems.length; s++) {
        this.systems[s].onEntityAdded(entity); // Notify system of new entity
    }
};

ComponentFamily.prototype.afterUpdates = function() {
    if(this.removeEntities.length === 0) return;
    for(var e = 0; e < this.removeEntities.length; e++) {
        util.removeFromArray(this.removeEntities[e], this.entities);
    }
    for(var s = 0; s < this.systems.length; s++) {
        this.systems[s].onEntityRemoved(this.removeEntities); // Notify system of removal
    }
    this.removeEntities.length = 0;
};