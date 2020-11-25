import { System } from "ecsy"
import Sprite from "../components/sprite"
import Transform from "../components/transform"
import { get2dCoordsFromIso, getZIndex } from "../../common/projection"

export default class TransformSystem extends System {
  execute(_delta: number, _time: number) {
    let update = (entity: any) => {
      let { x, y, z } = entity.getComponent(Transform)!
      let sprite = entity.getMutableComponent(Sprite)!
      let [newX, newY] = get2dCoordsFromIso(x, y, z)
      sprite.x = newX
      sprite.y = newY
      sprite.zIndex = getZIndex(x, y, z)
    }

    this.queries.sprites.added!.forEach(update)
    this.queries.sprites.changed!.forEach(update)
  }
}

TransformSystem.queries = {
  sprites: {
    components: [Sprite, Transform],
    listen: { added: true, changed: [Transform] },
  },
}
