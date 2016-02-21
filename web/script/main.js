'use strict';

var EntityManager = require('./managers/manager-entity');

var systems = [
    {
        name: 'TestSystem',
        components: ['a','m','x']
    },
    {
        name: 'TestSystem2',
        components: ['a','m','x','ac','d','h','t','p','l']
    },
    {
        name: 'TestSystem3',
        components: ['ad','ac']
    },
    {
        name: 'TestSystem4',
        components: ['a','m','x','ac','d','h','t','p','l']
    },
    {
        name: 'TestSystem5',
        components: ['a','m','x']
    },
    {
        name: 'TestSystem6',
        components: ['a','m','x','ac','d','h','t','p','l']
    },
    {
        name: 'TestSystem7',
        components: ['ad','ac']
    },
    {
        name: 'TestSystem8'
    }
];

var componentNames = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
    'n','o','p','q','r','s','t','u','v','w','x','y','z','aa','ab','ac','ad']; // 30 test components
var componentList = [];
for(var cn = 0; cn < componentNames.length; cn++) {
    componentList.push({name:componentNames[cn]});
}

// Benchmarking

EntityManager.init(systems); // All systems must be registered on initialization

var e, c;

console.time('addEntities'); // Add 1000 entities
for(e = 0; e < 1000; e++) {
    EntityManager.addEntity();
}
console.timeEnd('addEntities');

console.time('addComponents'); // Add 30 components to every entity
for(e = 0; e < 1000; e++) {
    for(c = 0; c < componentList.length; c++) {
        EntityManager.addComponent(e,componentList[c].name);
    }
}
console.timeEnd('addComponents'); 
// Wow, ~90ms for 1000 entities x 30 components x 8 systems, linear growth

console.time('removeComponents'); // Remove components from all entities
for(e = 0; e < 1000; e++) {
    for(c = 0; c < componentList.length; c++) {
        EntityManager.removeComponent(e,componentList[c].name);
    }
}
console.timeEnd('removeComponents'); // About the same as adding components

console.time('removeEntities'); // Remove all entities
for(e = 0; e < 1000; e++) {
    EntityManager.removeEntity(e);
}
console.timeEnd('removeEntities');

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

console.log('Systems:',systems);
console.log('Entities:',EntityManager.entities);
console.log('Component Entities:',EntityManager.componentEntities);
console.log('Entity Components:',EntityManager.entityComponents);
console.log('Entity Component Families:',EntityManager.entityComponentFamilies);
console.log('Component Family Entities:',EntityManager.componentFamilyEntities);