import { Query, System } from 'ape-ecs'
import { Cell3D } from '../../common/map'
import Transform from '../components/transform'
import MapCell from '../components/map-cell'
import Actor from '../components/actor'
import ActorCell from '../../common/actor-cell'

export default class MapSystem extends System {
	private map: any
	private mapQuery!: Query
	private mapAddQuery!: Query
	private mapRemoveQuery!: Query
	init(map: any) {
		this.map = map
		this.mapQuery = this.createQuery().fromAll(Transform, MapCell).persist()
		this.mapAddQuery = this.createQuery()
			.fromAll(Transform)
			.not(MapCell)
			.persist()
		this.mapRemoveQuery = this.createQuery()
			.fromAll(MapCell)
			.not(Transform)
			.persist()
	}

	update(tick: number) {
		this.mapAddQuery.execute().forEach((entity) => {
			const { x, y, z } = entity.c.transform
			const cellType = entity.has(Actor.typeName) ? ActorCell : Cell3D
			const cell = new cellType({ map: this.map, x, y, z })
			entity.addComponent({ type: MapCell.typeName, cell, key: 'mapCell' })
			this.map.addCell(cell)
		})
		this.mapQuery.execute().forEach((entity) => {
			if (entity.c.transform._meta.updated !== tick) return
			entity.c.mapCell.cell.moveTo(entity.c.transform)
		})
		this.mapRemoveQuery.execute().forEach((entity) => {
			entity.c.mapCell.cell.destroy()
			entity.removeComponent(entity.c.mapCell)
		})
	}
}
