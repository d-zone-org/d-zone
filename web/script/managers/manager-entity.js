'use strict';

var nextEntityID = 0;
var entities = [];
var componentEntities = {}; // Component > Entity list
var entityComponents = []; // Entity > Component list
var entitySystems = []; // Entity > System list
var systems = [];

module.exports = {
    init: function(s) {
        systems = s;
        systems.forEach(function(system) {
            system.entities = system.components ? [] : entities;
        });
    },
    addEntity: function() {
        var newEntity = nextEntityID;
        entities.push(newEntity);
        entityComponents[newEntity] = []; // Entity starts with no components or systems
        entitySystems[newEntity] = [];
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
        systems.forEach(function(system) {
            if(!system.components || system.components.indexOf(component) < 0) return;
            for(var c = 0; c < system.components.length; c++) { // Loop system's components
                if(entityComponents[entity].indexOf(system.components[c]) < 0) {
                    return; // System doesn't match if this entity lacks one of its components
                }
            }
            system.entities.push(entity); // Entity has all required components, add to system entity list
            entitySystems[entity].push(system.name);
        });
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
        for(var e = 0; e < componentEntities[component].length; e++) {
            if(componentEntities[component][e] == entity) {
                componentEntities[component].splice(e,1);
                break;
            }
        }
        // Remove entity from any systems that relied on this component
        systems.forEach(function(system) {
            if(!system.components 
                || system.components.indexOf(component) < 0 // System doesn't use this component
                || entitySystems[entity].indexOf(system.name) < 0) { // Entity not in this system
                return;
            }
            for(var e = 0; e < system.entities.length; e++) {
                if(system.entities[e] == entity) {
                    system.entities.splice(e,1); // Remove entity from this system
                    entitySystems[entity].splice(entitySystems[entity].indexOf(system.name),1);
                    break;
                }
            }
        });
    },
    componentEntities: componentEntities,
    entityComponents: entityComponents
};