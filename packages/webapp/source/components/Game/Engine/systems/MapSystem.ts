import { Attributes, Not, System } from 'ecsy'
import { Cell3D, Map3D } from '../../Common/Map'
import Transform from '../components/Transform'
import MapCell from '../components/MapCell'
import Actor from '../components/Actor'
import ActorCell from '../../Common/ActorCell'
export default class MapSystem extends System {
	private map: Map3D | undefined
	init(attributes: Attributes): void {
		this.map = attributes.map
	}

	execute(_delta: number, _time: number): void {
		const map = this.map as Map3D
		this.queries.added.results.forEach((entity) => {
			const { x, y, z } = entity.getComponent(Transform) as Transform
			const cellType = entity.hasComponent(Actor) ? ActorCell : Cell3D
			const cell = new cellType({ map, x, y, z })
			entity.addComponent(MapCell, { value: cell })
			map.addCell(cell)
		})
		this.queries.moved.changed?.forEach((entity) => {
			const mapCell = entity.getComponent(MapCell) as MapCell
			mapCell.value.moveTo(entity.getComponent(Transform) as Transform)
		})
		const removed = this.queries.removed.results
		for (let i = removed.length - 1; i >= 0; i--) {
			const entity = removed[i]
			const mapCell = entity.getComponent(MapCell) as MapCell
			mapCell.value.destroy()
			entity.removeComponent(MapCell)
		}
	}
}
MapSystem.queries = {
	added: {
		components: [Transform, Not(MapCell)],
	},
	moved: {
		components: [Transform, MapCell],
		listen: { changed: [Transform] },
	},
	removed: {
		components: [Not(Transform), MapCell],
	},
}
