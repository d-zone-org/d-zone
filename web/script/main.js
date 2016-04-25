'use strict';
var util = require('./common/util');

var components = [
    require('./components/component-sprite'),
    require('./components/component-animation')
];
var systems = [
    require('./systems/system-move'),
    require('./systems/system-animate'),
    require('./systems/system-render')
];

var GameManager = require('./managers/manager-game');
var EntityManager = require('./managers/manager-entity');
var ComponentManager = require('./managers/manager-component');
var SpriteManager = require('./managers/manager-sprite');
var CanvasManager = require('./managers/manager-canvas');
var WorldManager = require('./managers/manager-world');

// Initialize managers
SpriteManager.init(['actors','environment','static-tiles','props','font']);
CanvasManager.init({ id: 'main', initialScale: 2 });
GameManager.init(systems);
ComponentManager.init(components,systems);
WorldManager.generateWorld(20);

//benchmark();

function benchmark() {
    var SPRITE = require('./components/component-sprite');
    var ANIMATION = require('./components/component-animation');
    var e;
    console.time('addEntities'); // Add 1000 entities
    for(e = 0; e < 1000; e++) {
        var entity = EntityManager.addEntity();
        EntityManager.addComponent(entity,SPRITE, {
            x: util.randomIntRange(0,300),
            y: util.randomIntRange(0,300),
            w: util.randomIntRange(5,15),
            h: util.randomIntRange(5,15),
            color: '#' + util.randomIntRange(0,256*256*256).toString(16)
        });
        EntityManager.addComponent(entity,ANIMATION, { state: util.pickInArray(['expand','shrink']) });
    }
    console.timeEnd('addEntities');
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
