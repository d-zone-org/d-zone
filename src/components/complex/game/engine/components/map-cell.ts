import { Component, Types } from "ecsy"
import { Cell3D } from "../../common/map"

export default class MapCell extends Component<MapCell> {
  value!: Cell3D
}

MapCell.schema = {
  value: { type: Types.Ref },
}
