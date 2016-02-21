'use strict';

var nextEntityID = 0;
var entities = [];
var componentEntities = {}; // Component > Entity list
var entityComponents = []; // Entity > Component list
var entityComponentFamilies = []; // Entity > Component Family list
var componentFamilyEntities = {}; // Component family > Entity list

module.exports = {
    init: function(systems) {
        systems.forEach(function(system) {
            if(system.components) {
                var componentFamily = system.components.sort().join(':');
                if(!componentFamilyEntities[componentFamily]) {
                    componentFamilyEntities[componentFamily] = [];
                }
                system.entities = componentFamilyEntities[componentFamily];
            } else {
                system.entities = entities;
            }
        });
    },
    addEntity: function() {
        var newEntity = nextEntityID;
        entities.push(newEntity);
        entityComponents[newEntity] = []; // Entity starts with no components or systems
        entityComponentFamilies[newEntity] = [];
        nextEntityID++;
        return newEntity;
    },
    addComponent: function(entity,component) {
        if(entityComponents[entity].indexOf(component) >= 0) { // Entity already has component
            console.error('Entity',entity,'already has component',component);
        }
        //console.log('adding component',component,'to entity',entity);
        if(!componentEntities[component]) {
            componentEntities[component] = [];
        }
        componentEntities[component].push(entity);
        entityComponents[entity].push(component);
        // Add entity to systems that need to update it
        for(var cf in componentFamilyEntities) {
            if(!componentFamilyEntities.hasOwnProperty(cf)) continue;
            var components = cf.split(':');
            if(components.indexOf(component) < 0) continue;
            var matchesFamily = true;
            for(var c = 0; c < components.length; c++) { // Loop family's components
                if(entityComponents[entity].indexOf(components[c]) < 0) {
                    matchesFamily = false;
                    break; // Entity doesn't have one of family's components
                }
            }
            if(matchesFamily) { // Entity has all required components, add to family entity list
                componentFamilyEntities[cf].push(entity);
                entityComponentFamilies[entity].push(cf);
            }
        }
    },
    removeComponent: function(entity,component) {
        if(entityComponents[entity].indexOf(component) < 0) { // Entity doesn't have this component
            console.error('Entity',entity,'does not have component',component);
        }
        //console.log('removing component',component,'from entity',entity);
        for(var c = 0; c < entityComponents[entity].length; c++) {
            if(entityComponents[entity][c] == component) {
                entityComponents[entity].splice(c,1);
                break;
            }
        }
        var e;
        for(e = 0; e < componentEntities[component].length; e++) {
            if(componentEntities[component][e] == entity) {
                componentEntities[component].splice(e,1);
                break;
            }
        }
        // Remove entity from any component families that relied on this component
        for(var cf in componentFamilyEntities) {
            if(!componentFamilyEntities.hasOwnProperty(cf)) continue;
            var components = cf.split(':');
            if(components.indexOf(component) < 0 
                || entityComponentFamilies[entity].indexOf(cf) < 0) continue;
            for(e = 0; e < componentFamilyEntities[cf].length; e++) {
                if(componentFamilyEntities[cf][e] == entity) {
                    componentFamilyEntities[cf].splice(e,1); // Remove entity from this family
                    entityComponentFamilies[entity].splice(entityComponentFamilies[entity].indexOf(cf),1);
                    break;
                }
            }
        }
    },
    componentEntities: componentEntities,
    entityComponents: entityComponents,
    entityComponentFamilies: entityComponentFamilies,
    componentFamilyEntities: componentFamilyEntities
};