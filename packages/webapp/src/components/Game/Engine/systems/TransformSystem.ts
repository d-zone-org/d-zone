import { Entity, System, Component } from 'ecs-lib'
import { Sprite, SpriteComponent } from '../components/SpriteComponent'
import { Transform, TransformComponent } from '../components/TransformComponent'

export default class TransformSystem extends System {
	constructor() {
		super([SpriteComponent.type, TransformComponent.type])
	}

	update(_time: number, _delta: number, entity: Entity): void {
		let transform: Component<Transform> = TransformComponent.oneFrom(entity)
		let sprite: Component<Sprite> = SpriteComponent.oneFrom(entity)
		if (
			sprite.data.x !== transform.data.x ||
			sprite.data.y !== transform.data.y
		) {
			sprite.data.x = transform.data.x
			sprite.data.y = transform.data.y
			sprite.data.dirty = true
		}
	}
}
