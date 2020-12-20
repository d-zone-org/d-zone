import { Query, System } from 'ape-ecs'
import Transform from '../components/transform'
import MapCell from '../components/map-cell'

/** Manages the link between [[Transform]] components and [[MapCell]] components. */
export default class MapSystem extends System {
	private mapQuery!: Query
	init() {
		this.mapQuery = this.createQuery().fromAll(Transform, MapCell).persist()
	}

	/**
	 * Moves map cells when transform component is updated.
	 *
	 * @param tick - The current game engine tick.
	 */
	update(tick: number) {
		this.mapQuery.execute().forEach((entity) => {
			if (entity.c[Transform.key]._meta.updated !== tick) return
			entity.c[MapCell.key].cell.moveToGrid(
				entity.c[Transform.key] as Transform
			)
		})
	}
}
