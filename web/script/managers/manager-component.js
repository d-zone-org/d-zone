'use strict';
// Stores component data for all entities

var componentLibrary = {
    'sprite': require('./../components/component-sprite'),
    'animation': require('./../components/component-animation')
};

var componentEntityData = {}; // Component > Entity data

module.exports = {
    getComponentData: function (components) {
        var componentData = [];
        components.forEach(function(component) {
            if(!componentEntityData[component]) {
                componentEntityData[component] = [];
            }
            componentData.push(componentEntityData[component]);
        });
        return componentData;
    },
    addComponent: function(entity,component,data) {
        if(!componentEntityData[component]) { // Don't really need to check this
            console.log('Component',component,'is not used by any systems!');
            componentEntityData[component] = [];
        }
        var componentData = (new componentLibrary[component]()).data; // Get default data
        // TODO: Implement flyweight pattern?
        for(var prop in data) { // Apply custom data
            if(!data.hasOwnProperty(prop)) continue;
            componentData[prop] = data[prop];
        }
        componentEntityData[component][entity] = componentData;
    }
};