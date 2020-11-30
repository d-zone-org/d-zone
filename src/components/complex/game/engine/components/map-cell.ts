import { Component, EntityRef } from "ape-ecs"
import { Cell3D } from "../../common/map"

export default class MapCell extends Component {
  cell!: Cell3D

  static properties = {
    cell: EntityRef
  }
}
