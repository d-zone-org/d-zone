import { Entity, System } from 'ecs-lib'
import { TransformComponent } from '../components/TransformComponent'
import { HopComponent } from '../components/HopComponent'

export default class HopSystem extends System {
	constructor() {
		super([TransformComponent.type, HopComponent.type])
	}

	update(_time: number, delta: number, entity: Entity): void {
		let transform = TransformComponent.oneFrom(entity)
		let hop = HopComponent.oneFrom(entity)

		if (hop.attr.progress >= 1) {
			transform.data.x += hop.data.x
			transform.data.y += hop.data.y
			transform.data.z += hop.data.z
			entity.remove(hop)
			return
		}

		hop.attr.progress += delta / (1000 / 60) / 30
	}

	enter(entity: Entity): void {
		let hop = HopComponent.oneFrom(entity)
		hop.attr.progress = 0
	}
}
