import { Component } from 'ape-ecs'
import { Cell3D } from '../../common/map'

export default class MapCell extends Component {
	cell!: Cell3D
	static typeName = 'MapCell'
	static properties = {
		cell: null,
	}
}
