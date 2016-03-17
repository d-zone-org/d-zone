'use strict';
var System = require('./system');
var RenderManager = require('./../managers/manager-render');

var move = new System('move',['sprite']);

move.updateEntity = function(entity) {
    var sprite = this.componentData[0][entity];
};

module.exports = move;