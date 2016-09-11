'use strict';
var System = require('system');
var RenderManager = require('manager-render');

var move = new System('move',[
    require('component-sprite')
]);

move.updateEntity = function(entity, sprite) {
    
};

module.exports = move;