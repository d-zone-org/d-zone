import { Component, Entity } from 'ape-ecs'
import type Map3D from '../../common/map-3d'

/** Data for an entity's map. */
export default class Map extends Component {
	/** The map instance. */
	map!: Map3D<Entity>
	static typeName = 'Map'
	static key = 'map'
	static properties = {
		map: null,
	}
	preDestroy() {
		// Remove the entity from the map when this component is destroyed
		const entityGrid = this.map.getCellGrid(this.entity)
		if (entityGrid) this.map.removeCellFromGrid(this.entity, entityGrid)
	}
}
