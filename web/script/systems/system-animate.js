'use strict';
var System = require('./system');

var animate = new System('animate',[
    require('./../components/component-sprite'),
    require('./../components/component-animation')
]);

animate.updateEntity = function(entity, sprite, animation) {
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