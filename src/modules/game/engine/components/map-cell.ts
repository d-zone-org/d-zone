import { Component } from 'ape-ecs'
import { Cell3D } from '../../common/cell-3d'

/** Data for an entity's map cell. */
export default class MapCell extends Component {
	/** The map cell. */
	cell!: Cell3D
	static typeName = 'MapCell'
	static key = 'mapCell'
	static properties = {
		cell: null,
	}
}
