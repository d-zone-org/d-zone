import { Entity } from 'ecs-lib'
import { Actor, ActorComponent } from '../components/ActorComponent'
import { Transform, TransformComponent } from '../components/TransformComponent'
import { SpriteComponent } from '../components/SpriteComponent'

export default class ActorEntity extends Entity {
	constructor(actor: Actor, transform: Transform) {
		super()

		this.add(new ActorComponent(actor))
		this.add(new TransformComponent(transform))
		this.add(
			new SpriteComponent({
				x: -7,
				y: -7,
				width: 14,
				height: 14,
				sheet: 'cube',
				sheetX: 0,
				sheetY: 0,
				render: true,
				dirty: false,
				zIndex: 0,
			})
		)
	}
}
