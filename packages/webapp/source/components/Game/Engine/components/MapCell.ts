import { Component, Types } from 'ecsy'
import { Cell3D } from '../../Common/Map'

export default class MapCell extends Component<MapCell> {
	value!: Cell3D
}

MapCell.schema = {
	value: { type: Types.Ref },
}
