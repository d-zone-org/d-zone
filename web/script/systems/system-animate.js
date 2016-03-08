'use strict';

var components = ['sprite','animation']; // Components used by this system
var entities, componentData;

function updateEntity(sprite,animation) {
    
}

module.exports = {
    init: function(e,c) {
        entities = e;
        componentData = c;
    },
    name: 'animate',
    components: components,
    update: function() {
        if(!entities) {
            console.error('System trying to update before initialization');
        }
        for(var e = 0; e < entities.length; e++) {
            var entityID = entities[e];
            updateEntity(componentData[0][entityID],componentData[1][entityID]);
        }
    }
};