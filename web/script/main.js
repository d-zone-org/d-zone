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

EntityManager.init(systems);

console.time('addEntities');
var e;
for(e = 0; e < 1000; e++) {
    EntityManager.addEntity();
}
console.timeEnd('addEntities');

console.time('addComponents');
var c;
//for(var c = 0; c < 10; c++) {
//    EntityManager.addComponent(0,componentList[c].id);
//}
for(e = 0; e < 1000; e++) {
    for(c = 0; c < componentList.length; c++) {
        EntityManager.addComponent(e,componentList[c].name);
    }
}
console.timeEnd('addComponents'); 
// Wow, ~90ms for 1000 entities x 30 components x 8 systems, linear growth

console.time('removeComponents');
//for(var c = 0; c < 10; c++) {
//    EntityManager.addComponent(0,componentList[c].id);
//}
for(e = 0; e < 1000; e++) {
    for(c = 0; c < componentList.length; c++) {
        EntityManager.removeComponent(e,componentList[c].name);
    }
}
console.timeEnd('removeComponents'); // About the same as adding components

console.log('Systems:',systems);
console.log('Component Entities:',EntityManager.componentEntities);
console.log('Entity Components:',EntityManager.entityComponents);