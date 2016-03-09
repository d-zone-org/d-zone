'use strict';
var System = require('./system');

var animate = new System('animate',['sprite','animation']);

animate.updateEntity = function(entity) {
    var sprite = this.componentData[0][entity];
    var animation = this.componentData[1][entity];
    if(animation.state == 'expand') {
        sprite.w++;
        sprite.h++;
        if(sprite.w == 20 || sprite.h == 20) {
            animation.state = 'shrink';
        }
    } else {
        sprite.w--;
        sprite.h--;
        if(sprite.w == 1 || sprite.h == 1) {
            animation.state = 'expand';
        }
    }
};

module.exports = animate;