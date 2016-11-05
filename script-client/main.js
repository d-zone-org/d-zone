'use strict';
console.log(`###### D-ZONE ${require('json!./../package.json').version} ######`);
var EventEmitter = require('events').EventEmitter;
global.dz = { events: new EventEmitter() }; // D-Zone globals

var util = require('dz-util');

var components = [
    require('com-sprite3d'),
    require('com-animation'),
    require('com-movement'),
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
var SpriteManager = require('man-sprite');
var ViewManager = require('man-view');
var WorldManager = require('man-world');

// Initialize managers
SpriteManager.init(['actors', 'environment', 'static-tiles', 'props', 'font']);
ViewManager.init({ id: 'main', initialScale: 2, maxScale: 4 });
GameManager.init(systems);
ComponentManager.init(components, systems);
WorldManager.generateWorld(20);

var ACTOR = require('ent-actor');
EntityManager.addEntity(ACTOR);