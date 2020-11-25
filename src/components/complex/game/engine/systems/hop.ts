import { Attributes, System } from "ecsy"
import Hop from "../components/hop"
import Transform from "../components/transform"
import Sprite from "../components/sprite"
import MapCell from "../components/map-cell"
import ActorCell from "../../common/actor-cell"
import {
  hopUpYOffsets,
  hopDownYOffsets,
  hopZDepthOffsets,
} from "web/art/sprite-config.json"

let hopFrameCount: number
let hopFrameRate = 2

export default class HopSystem extends System {
  private animations: any
  init(attributes: Attributes) {
    this.animations = attributes.resources.sheet.spritesheet.animations
    hopFrameCount = this.animations["hop-east"].length
  }
  execute(_delta: number, _time: number) {
    let added = this.queries.hopping.added
    if (added) {
      added.forEach((entity) => {
        let hop = entity.getMutableComponent(Hop)!
        let actorCell = entity.getComponent(MapCell)!.value as ActorCell
        let target = actorCell.getHopTarget(hop)
        if (target) {
          actorCell.reserveTarget(target)
          actorCell.properties.platform = false
          Object.assign(hop, target)
        } else {
          faceSpriteToHop(entity.getMutableComponent(Sprite)!, hop)
          entity.removeComponent(Hop)
        }
      })
    }

    let hopping = this.queries.hopping.results
    for (let i = hopping.length - 1; i >= 0; i--) {
      let entity = hopping[i]
      let hop = entity.getMutableComponent(Hop)!
      let frame = Math.floor(hopFrameCount * hop.progress)
      if (hop.progress >= 1) {
        let transform = entity.getMutableComponent(Transform)!
        transform.x += hop.x
        transform.y += hop.y
        transform.z += hop.z
        faceSpriteToHop(entity.getMutableComponent(Sprite)!, hop)
        entity.getComponent(MapCell)!.value.properties.platform = true
        entity.removeComponent(Hop)
      } else if (hop.progress === 0 || frame > hop.frame) {
        hop.frame = frame
        let sprite = entity.getMutableComponent(Sprite)!
        sprite.texture = this.animations[`hop-${hop.direction}`][
          hop.frame
        ].textureCacheIds[0]
        if (hop.progress === 0) sprite.zIndex += 0.01
        let zDepthOffsetIndex = hopZDepthOffsets.frames.indexOf(hop.frame)
        if (zDepthOffsetIndex >= 0) {
          // Adjust z-depth while hopping
          sprite.zIndex +=
            hopZDepthOffsets[hop.direction as keyof typeof hopZDepthOffsets][
              zDepthOffsetIndex
            ]
        }
        if (hop.z !== 0) {
          // Raise or lower sprite while hopping up/down
          let yOffsets = hop.z > 0 ? hopUpYOffsets : hopDownYOffsets
          let yOffsetIndex = yOffsets.frames.indexOf(hop.frame)
          if (yOffsetIndex >= 0) sprite.y += yOffsets.values[yOffsetIndex]
        }
      }
      hop.progress += 1 / hopFrameCount / hopFrameRate
    }
  }
}
HopSystem.queries = {
  hopping: {
    components: [Hop, Transform, Sprite, MapCell],
    listen: { added: true },
  },
}
function faceSpriteToHop(sprite: Sprite, hop: Hop) {
  if (hop.direction === "east") sprite.texture = "cube:0"
  else if (hop.direction === "south") sprite.texture = "cube:1"
  else sprite.texture = "cube:2"
}
