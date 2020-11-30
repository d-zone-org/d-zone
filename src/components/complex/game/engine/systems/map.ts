import { Query, System } from 'ape-ecs'
import { Cell3D } from '../../common/map'
import Transform from '../components/transform'
import MapCell from '../components/map-cell'
import Actor from '../components/actor'
import ActorCell from '../../common/actor-cell'

export default class MapSystem extends System {
	private map: any
	private mapQuery!: Query
	init(map: any) {
		this.map = map
		this.mapQuery = this.createQuery().fromAll(Transform).persist(true, true)
	}

	update(tick: number) {
		this.mapQuery.added.forEach((entity) => {
			let { x, y, z } = entity.c.transform
			let cellType = entity.has(Actor.typeName) ? ActorCell : Cell3D
			let cell = new cellType({ map: this.map, x, y, z })
			entity.addComponent({ type: MapCell.typeName, cell, key: 'mapCell' })
			this.map.addCell(cell)
		})
		this.mapQuery.execute({ updatedValues: tick }).forEach((entity) => {
			entity.c.mapCell.cell.moveTo(entity.c.transform)
		})
		this.mapQuery.removed.forEach((entity) => {
			entity.c.mapCell.cell.destroy()
			entity.removeComponent(MapCell.typeName)
		})
	}
}
