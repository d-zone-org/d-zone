'use strict';
var util = require('dz-util');
// Manages component families and data for all entities

var components, systems;
var componentData = []; // Array of arrays, indexed by component then entity
var componentFamilies = [];

module.exports = {
    init: function(c,s) {
        components = c;
        for(var i = 0; i < components.length; i++) {
            componentData[i] = [];
        }
        systems = s;
        systems.forEach(function(system) {
            if(!system.components) return;
            var familyMask = getComponentMask(system.components);
            var componentFamily;
            for(var cf = 0; cf < componentFamilies.length; cf++) {
                if(componentFamilies[cf].mask === familyMask) {
                    componentFamily = componentFamilies[cf];
                    break;
                }
            }
            if(!componentFamily) {
                componentFamily = new ComponentFamily(system.components);
                componentFamilies.push(componentFamily);
            }
            componentFamily.addSystem(system);
        });
    },
    removeEntity: function(entity) {
        componentData.forEach(function(cd) { // Delete all component data
            delete cd[entity];
        });
        componentFamilies.forEach(function(family) {
            family.removeEntity(entity, 0); // Notify all families
        });
    },
    newComponent: function(entity, mask, component, data) {
        var thisComponentData = componentData[components.indexOf(component)];
        thisComponentData[entity] = (new component()).data; // Get default data
        for(var prop in data) { // Apply custom data
            if(!data.hasOwnProperty(prop)) continue;
            thisComponentData[entity][prop] = data[prop];
        }
        componentFamilies.forEach(function(family) {
            family.addEntity(entity, mask); // Notify families that match new mask
        });
    },
    removeComponent: function(entity, component) {
        delete componentData[components.indexOf(component)][entity]; // Delete component data
        componentFamilies.forEach(function(family) {
            family.removeEntity(entity, getComponentMask([component])); // Notify families that require component
        });
    },
    getComponentData: getComponentData,
    getComponentMask: getComponentMask
};

function getComponentData(family) {
    var familyData = [];
    family.forEach(function(component) {
        familyData.push(componentData[components.indexOf(component)]);
    });
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
    componentList.forEach(function(c, i) {
        this.componentNames += (i == 0 ? '' : '-') + c.name;
    }, this);
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
    util.removeFromArray(entity, this.entities);
    this.systems.forEach(function(sys) {
        sys.onEntityRemoved(); // Notify system of removal
    });
};

ComponentFamily.prototype.addEntity = function(entity, entityMask) {
    if(this.mask !== (this.mask & entityMask)) return; // Ignore if entity doesn't match family
    if(this.entities.indexOf(entity) >= 0) return; // Ignore if entity already in this family
    this.entities.push(entity);
    this.systems.forEach(function(sys) {
        sys.onEntityAdded(entity); // Notify system of new entity
    },this);
};

// Debug
global.dz.events.on('key-s', function() {
    // Example of accessing component data --data[component][entity]
    console.log(componentData[0][0]);
    componentData[0][0].sheet = 'font'; 
});
global.dz.events.on('key-d', function() {
    console.log(componentData);
    console.log(componentFamilies);
});