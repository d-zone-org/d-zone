import { Entity, System, Component } from 'ecs-lib'
import { Sprite, SpriteComponent } from '../components/SpriteComponent'
import { Transform, TransformComponent } from '../components/TransformComponent'
import { get2dCoordsFromIso, getZIndex } from '../../Common/Projection'

export default class TransformSystem extends System {
	constructor() {
		super([SpriteComponent.type, TransformComponent.type])
	}

	update(_time: number, _delta: number, entity: Entity): void {
		let transform: Component<Transform> = TransformComponent.oneFrom(entity)
		let sprite: Component<Sprite> = SpriteComponent.oneFrom(entity)
		let { x: prevX, y: prevY } = sprite.data
		let { x, y, z } = transform.data
		let [newX, newY] = get2dCoordsFromIso(x, y, z)
		if (prevX !== newX || prevY !== newY) {
			sprite.data.x = newX
			sprite.data.y = newY
			sprite.data.zIndex = getZIndex(x, y, z)
			sprite.data.dirty = true
		}
	}
}
