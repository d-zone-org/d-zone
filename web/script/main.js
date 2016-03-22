'use strict';
var util = require('./common/util');

var GameManager = require('./managers/manager-game');
var EntityManager = require('./managers/manager-entity');
var CanvasManager = require('./managers/manager-canvas');
var WorldManager = require('./managers/manager-world');

var MoveSystem = require('./systems/system-move');
var AnimateSystem = require('./systems/system-animate');
var RenderSystem = require('./systems/system-render');

// Configure systems
RenderSystem.configure({ backgroundColor: '#181213' });

var systems = [MoveSystem,AnimateSystem,RenderSystem];

// Initialize managers
GameManager.init(systems);
EntityManager.init(systems);
CanvasManager.init({ id: 'main', initialScale: 2 });
WorldManager.generateWorld(30);

//benchmark();

function benchmark() {
    var e;
    console.time('addEntities'); // Add 1000 entities
    for(e = 0; e < 1000; e++) {
        EntityManager.addEntity();
    }
    console.timeEnd('addEntities');
    
    console.time('addComponents'); // Add components to every entity
    for(e = 0; e < 1000; e++) {
        EntityManager.addComponent(e,'sprite', { 
            x: util.randomIntRange(0,400),
            y: util.randomIntRange(0,400),
            w: util.randomIntRange(5,15),
            h: util.randomIntRange(5,15),
            color: '#' + util.randomIntRange(0,256*256*256).toString(16)
        });
        EntityManager.addComponent(e,'animation', { state: util.pickInArray(['expand','shrink']) });
    }
    console.timeEnd('addComponents');
    // Wow, ~90ms for 1000 entities x 30 components x 8 systems, linear growth
    
    //console.time('removeComponents'); // Remove components from all entities
    //for(e = 0; e < 1000; e++) {
    //    for(c = 0; c < componentList.length; c++) {
    //        EntityManager.removeComponent(e,componentList[c].name);
    //    }
    //}
    //console.timeEnd('removeComponents'); // About the same as adding components

    //console.time('removeEntities'); // Remove all entities
    //for(e = 0; e < 1000; e++) {
    //    EntityManager.removeEntity(e);
    //}
    //console.timeEnd('removeEntities'); // ~20ms to remove 1000 entities with 30 components each

    //console.time('addEntities'); // Add 1000 entities again
    //for(e = 0; e < 1000; e++) {
    //    EntityManager.addEntity();
    //}
    //console.timeEnd('addEntities');
    //
    //console.time('addComponents'); // Add components again
    //for(e = 0; e < 1000; e++) {
    //    for(c = 0; c < componentList.length; c++) {
    //        EntityManager.addComponent(e,componentList[c].name);
    //    }
    //}
    //console.timeEnd('addComponents');

    //console.log('Systems:',systems);
    //console.log('Entities:',EntityManager.entities);
    //console.log('Component Entities:',EntityManager.componentEntities);
    //console.log('Entity Components:',EntityManager.entityComponents);
    //console.log('Entity Component Families:',EntityManager.entityComponentFamilies);
    //console.log('Component Family Entities:',EntityManager.componentFamilyEntities);
}
