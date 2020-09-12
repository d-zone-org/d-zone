import { Entity, System } from 'ecsy'
import Sprite from '../components/Sprite'
import Transform from '../components/Transform'
import { get2dCoordsFromIso, getZIndex } from '../../Common/Projection'

export default class TransformSystem extends System {
	execute(_delta: number, _time: number): void {
		const update = (entity: Entity) => {
			const { x, y, z } = entity.getComponent(Transform) as Transform
			const sprite = entity.getMutableComponent(Sprite) as Sprite
			const [newX, newY] = get2dCoordsFromIso(x, y, z)
			sprite.x = newX
			sprite.y = newY
			sprite.zIndex = getZIndex(x, y, z)
		}

		this.queries.sprites.added?.forEach(update)
		this.queries.sprites.changed?.forEach(update)
	}
}
TransformSystem.queries = {
	sprites: {
		components: [Sprite, Transform],
		listen: { added: true, changed: [Transform] },
	},
}
