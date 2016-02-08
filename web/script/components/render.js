'use strict';

module.exports = RenderComponent;

function RenderComponent(entity) {
    this.entity = entity;
}

RenderComponent.prototype.show = function() {
    this.entity.game.renderer.addToZBuffer(this.entity.sprite, this.entity.zDepth);
};

RenderComponent.prototype.hide = function() {
    this.entity.game.renderer.removeFromZBuffer(this.entity.sprite, this.entity.zDepth);
};