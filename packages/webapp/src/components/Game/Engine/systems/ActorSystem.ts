import { Entity, System } from 'ecs-lib'
import { ActorComponent } from '../components/ActorComponent'

export default class ActorSystem extends System {

	entities: Entity[] = []

	getEntities(): Entity[] {
		return this.entities
	}

	constructor() {
		super([
			ActorComponent.type,
		])
	}

	enter(entity: Entity): void {
		this.entities.push(entity)
	}
}
