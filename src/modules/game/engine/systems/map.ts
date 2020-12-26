import { Query, System } from 'ape-ecs'
import Transform from '../components/transform'
import Map from '../components/map'

/** Manages the link between [[Transform]] components and [[Map]] components. */
export default class MapSystem extends System {
	private mapQuery!: Query
	init() {
		this.mapQuery = this.createQuery().fromAll(Transform, Map).persist()
	}

	/**
	 * Moves map cells when transform component is updated.
	 *
	 * @param tick - The current game engine tick.
	 */
	update(tick: number) {
		this.mapQuery.execute().forEach((entity) => {
			if (entity.c[Transform.key]._meta.updated !== tick) return
			entity.c[Map.key].map.moveCellToGrid(
				entity,
				entity.c[Transform.key] as Transform
			)
		})
	}
}
