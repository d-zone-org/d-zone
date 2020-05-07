import { Entity, System } from 'ecs-lib'
import { TransformComponent } from '../components/TransformComponent'
import { SpriteComponent } from '../components/SpriteComponent'
import { getRenderer, createSprite } from '../../Renderer/Renderer'

export default class HopSystem extends System {

	private renderer: PIXI.Application

	constructor() {
		super([
			TransformComponent.type,
			SpriteComponent.type,
		])
		this.renderer = getRenderer()
	}

	enter(entity: Entity): void {
		let { data: { x, y } } = TransformComponent.oneFrom(entity)
		let sprite = SpriteComponent.oneFrom(entity)
		let pixiSprite: PIXI.Sprite = createSprite(sprite)
		pixiSprite.setTransform(x, y)
		// Add to renderer
		this.renderer.stage.addChild(pixiSprite)
	}
}
