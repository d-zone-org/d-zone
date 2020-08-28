import { Attributes, Not, System } from 'ecsy'
import { Cell3D } from '../../Common/Map'
import Transform from '../components/Transform'
import MapCell from '../components/MapCell'
export default class MapSystem extends System {
	private map: any
	init(attributes: Attributes) {
		this.map = attributes.map
	}

	execute(_delta: number, _time: number) {
		this.queries.added.results.forEach((entity) => {
			let { x, y, z } = entity.getComponent(Transform)!
			let cell = new Cell3D(this.map, x, y, z, entity)
			entity.addComponent(MapCell, { value: cell })
			this.map.addCell(cell)
		})
		this.queries.moving.changed!.forEach((entity) => {
			let { x, y, z } = entity.getComponent(Transform)!
			entity.getComponent(MapCell)!.value.moveTo(x, y, z)
		})
		let removed = this.queries.removed.results
		for (let i = removed.length - 1; i >= 0; i--) {
			let entity = removed[i]
			entity.getComponent(MapCell)!.value.destroy()
			entity.removeComponent(MapCell)
		}
	}
}
MapSystem.queries = {
	added: {
		components: [Transform, Not(MapCell)],
	},
	moving: {
		components: [Transform, MapCell],
		listen: { changed: [Transform] },
	},
	removed: {
		components: [Not(Transform), MapCell],
	},
}
