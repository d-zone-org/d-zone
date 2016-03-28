'use strict';
var System = require('./system');
var RenderManager = require('./../managers/manager-render');

var move = new System('move',[
    require('./../components/component-sprite')
]);

move.updateEntity = function(entity, sprite) {
    
};

module.exports = move;