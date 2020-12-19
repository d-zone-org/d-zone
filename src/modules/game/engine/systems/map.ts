import { Query, System } from 'ape-ecs'
import Transform from '../components/transform'
import MapCell from '../components/map-cell'

export default class MapSystem extends System {
	private mapQuery!: Query
	init() {
		this.mapQuery = this.createQuery().fromAll(Transform, MapCell).persist()
	}

	update(tick: number) {
		this.mapQuery.execute().forEach((entity) => {
			if (entity.c[Transform.key]._meta.updated !== tick) return
			entity.c[MapCell.key].cell.moveToGrid(
				entity.c[Transform.key] as Transform
			)
		})
	}
}
