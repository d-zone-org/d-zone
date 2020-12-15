import { Component } from 'ape-ecs'
import { Cell3D } from '../../common/cell-3d'

export default class MapCell extends Component {
	cell!: Cell3D
	static typeName = 'MapCell'
	static key = 'mapCell'
	static properties = {
		cell: null,
	}
}
