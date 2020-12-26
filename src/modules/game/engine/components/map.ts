import { Component } from 'ape-ecs'
import type Map3D from '../../common/map-3d'

/** Data for an entity's map. */
export default class Map<T> extends Component {
	/** The map instance. */
	map!: Map3D<T>
	static typeName = 'Map'
	static key = 'map'
	static properties = {
		map: null,
	}
}
