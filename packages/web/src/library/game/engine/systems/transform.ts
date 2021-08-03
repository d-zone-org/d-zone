import { Entity, Query, System } from 'ape-ecs'
import Transform from '../components/transform'
import Draw from '../components/draw'
import { get2dCoordsFromIso, getZIndex } from '../../common/projection'

/** Updates [[Draw]] components of entities based on their [[Transform]]. */
export default class TransformSystem extends System {
	private transformQuery!: Query

	init() {
		this.transformQuery = this.createQuery({
			all: [Transform, Draw],
			persist: true,
		})
	}

	/**
	 * Updates the screen coordinates and Z-index of [[Draw]] components based on
	 * the entity's location in 3D space.
	 *
	 * @param tick - The current game engine tick.
	 */
	update(tick: number) {
		this.transformQuery.execute().forEach((entity: Entity) => {
			if (entity.c[Transform.key]._meta.updated !== tick) return
			const { x, y, z } = entity.c[Transform.key] as Transform
			const [newX, newY] = get2dCoordsFromIso(x, y, z)
			entity.c[Draw.key].update({
				x: newX,
				y: newY,
				zIndex: getZIndex(x, y, z),
			})
		})
	}
}
