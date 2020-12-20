import { Entity, Query, System } from 'ape-ecs'
import Transform from '../components/transform'
import Sprite from '../components/sprite'
import { get2dCoordsFromIso, getZIndex } from '../../common/projection'

/** Updates sprites based on their transform. */
export default class TransformSystem extends System {
	private transformQuery!: Query

	init() {
		this.transformQuery = this.createQuery()
			.fromAll(Transform, Sprite)
			.persist(true)
	}

	/**
	 * Updates the coordinates and Z-index of sprites based on the entity's
	 * location in 3D space.
	 *
	 * @param tick - The current game engine tick.
	 */
	update(tick: number) {
		this.transformQuery.execute().forEach((entity: Entity) => {
			if (entity.c[Transform.key]._meta.updated !== tick) return
			const { x, y, z } = entity.c[Transform.key]
			const [newX, newY] = get2dCoordsFromIso(x, y, z)
			entity.c[Sprite.key].update({
				x: newX,
				y: newY,
				zIndex: getZIndex(x, y, z),
			})
		})
	}
}
