'use strict';
var util = require('dz-util');
// Manages component families and data for all entities

var components, systems;
var componentData = []; // Array of arrays, indexed by component then entity
var componentFamilies = [];

module.exports = {
    init(com, sys) {
        components = com;
        for(var c = 0; c < components.length; c++) {
            componentData[c] = [];
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
        for(var d = 0; d < componentData.length; d++) {
            delete componentData[d][entity];
        }
        for(var f = 0; f < componentFamilies.length; f++) {
            componentFamilies[f].removeEntity(entity, 0); // Notify all families
        }
    },
    newComponent(entity, mask, component, data) {
        var thisComponentData = componentData[components.indexOf(component)];
        thisComponentData[entity] = (new component()).data; // New instance of default data
        util.mergeObjects(thisComponentData[entity], data); // Apply custom data
        for(var f = 0; f < componentFamilies.length; f++) { // Notify families that require component
            componentFamilies[f].addEntity(entity, mask); // Notify families that match new mask
        }
    },
    removeComponent(entity, component) {
        delete componentData[components.indexOf(component)][entity]; // Delete component data
        for(var f = 0; f < componentFamilies.length; f++) { // Notify families that require component
            componentFamilies[f].removeEntity(entity, getComponentMask([component])); 
        }
    },
    getComponentData: getComponentData,
    getComponentMask: getComponentMask,
    componentData: componentData,
    componentFamilies: componentFamilies
};

function getComponentData(family) {
    var familyData = [];
    for(var c = 0; c < family.length; c++) {
        familyData.push(componentData[components.indexOf(family[c])]);
    }
    return familyData;
}

function getComponentMask(componentList) {
    var mask = 0;
    for(var i = 0; i < componentList.length; i++) {
        mask |= 1 << components.indexOf(componentList[i]);
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
    this.systems = [];
    this.componentData = getComponentData(componentList);
}

ComponentFamily.prototype.addSystem = function(system) {
    this.systems.push(system);
    system.init(this.entities, this.componentData);
};

ComponentFamily.prototype.removeEntity = function(entity, removeMask) {
    if(removeMask > 0 && removeMask !== (removeMask & this.mask)) return; // Ignore if family doesn't match removal
    for(var s = 0; s < this.systems.length; s++) {
        this.systems[s].onEntityRemoved(entity); // Notify system of removal
    }
};

ComponentFamily.prototype.addEntity = function(entity, entityMask) {
    if(this.mask !== (this.mask & entityMask)) return; // Ignore if entity doesn't match family
    if(this.entities.includes(entity)) return; // Ignore if entity already in this family
    this.entities.push(entity);
    for(var s = 0; s < this.systems.length; s++) {
        this.systems[s].onEntityAdded(entity); // Notify system of new entity
    }
};