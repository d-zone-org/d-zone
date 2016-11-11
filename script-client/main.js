'use strict';
console.log(`###### D-ZONE ${require('json!./../package.json').version} ######`);
var EventEmitter = require('events').EventEmitter;
var util = require('dz-util');
global.dz = { events: new EventEmitter() }; // D-Zone globals

var components = [
    require('com-sprite3d'),
    require('com-animation'),
    require('actor/com-movement'),
    require('com-collider')
];
var systems = [
    require('sys-move'),
    require('sys-animate'),
    require('sys-render')
];

var GameManager = require('man-game');
var EntityManager = require('man-entity');
var ComponentManager = require('man-component');
var RenderManager = require('man-render');
var SpriteManager = require('man-sprite');
var ViewManager = require('man-view');
var WorldManager = require('man-world');

// Initialize managers
SpriteManager.init(['actors', 'environment', 'static-tiles', 'props', 'font']);
ViewManager.init({ id: 'main', initialScale: 2, maxScale: 4 });
GameManager.init(systems);
ComponentManager.init(components, systems);
RenderManager.init(ComponentManager.getComponentData([require('com-sprite3d')])[0]);
WorldManager.generateWorld(20);

// Debug/Testing

var Actor = require('actor-ent');
var actor1 = EntityManager.addEntity(Actor.create({
    x: -2,
    y: 1
}));

global.dz.events.on('key-q', function() { // Log component data
    console.log(ComponentManager.componentData);
    console.log(ComponentManager.componentFamilies);
});
// WASD movement
global.dz.events.on('key-w', function() { Actor.hop(actor1, 'north'); });
global.dz.events.on('key-a', function() { Actor.hop(actor1, 'west'); });
global.dz.events.on('key-s', function() { Actor.hop(actor1, 'south'); });
global.dz.events.on('key-d', function() { Actor.hop(actor1, 'east'); });
// Game speed modifiers
global.dz.events.on('key-1', function() { GameManager.setStep(60); });
global.dz.events.on('key-2', function() { GameManager.setStep(30); });
global.dz.events.on('key-3', function() { GameManager.setStep(10); });
global.dz.events.on('key-4', function() { GameManager.setStep(5); });
global.dz.events.on('key-5', function() { GameManager.setStep(2); });
global.dz.events.on('key-6', function() { GameManager.setStep(1); });