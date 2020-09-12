import { Attributes, System } from 'ecsy'
import Hop from '../components/Hop'
import Transform from '../components/Transform'
import Sprite from '../components/Sprite'
import MapCell from '../components/MapCell'
import ActorCell from '../../Common/ActorCell'
import {
	hopUpYOffsets,
	hopDownYOffsets,
	hopZDepthOffsets,
} from '../../../../art/sprite-config.json'

let hopFrameCount: number
const hopFrameRate = 2

export default class HopSystem extends System {
	private animations: Record<string, PIXI.Texture[]> = {}
	init(attributes: Attributes): void {
		this.animations = attributes.resources.sheet.spritesheet.animations
		hopFrameCount = this.animations['hop-east'].length
	}
	execute(_delta: number, _time: number): void {
		const added = this.queries.hopping.added
		if (added) {
			added.forEach((entity) => {
				const hop = entity.getMutableComponent(Hop) as Hop
				const mapCell = entity.getComponent(MapCell) as MapCell
				const actorCell = mapCell.value as ActorCell
				const target = actorCell.getHopTarget(hop)
				if (target) {
					actorCell.reserveTarget(target)
					actorCell.properties.platform = false
					Object.assign(hop, target)
				} else {
					faceSpriteToHop(entity.getMutableComponent(Sprite) as Sprite, hop)
					entity.removeComponent(Hop)
				}
			})
		}

		const hopping = this.queries.hopping.results
		for (let i = hopping.length - 1; i >= 0; i--) {
			const entity = hopping[i]
			const hop = entity.getMutableComponent(Hop) as Hop
			const frame = Math.floor(hopFrameCount * hop.progress)
			if (hop.progress >= 1) {
				const transform = entity.getMutableComponent(Transform) as Transform
				transform.x += hop.x
				transform.y += hop.y
				transform.z += hop.z
				faceSpriteToHop(entity.getMutableComponent(Sprite) as Sprite, hop)
				const mapCell = entity.getComponent(MapCell) as MapCell
				mapCell.value.properties.platform = true
				entity.removeComponent(Hop)
			} else if (hop.progress === 0 || frame > hop.frame) {
				hop.frame = frame
				const sprite = entity.getMutableComponent(Sprite) as Sprite
				sprite.texture = this.animations[`hop-${hop.direction}`][
					hop.frame
				].textureCacheIds[0]
				if (hop.progress === 0) sprite.zIndex += 0.01
				const zDepthOffsetIndex = hopZDepthOffsets.frames.indexOf(hop.frame)
				if (zDepthOffsetIndex >= 0) {
					// Adjust z-depth while hopping
					sprite.zIndex +=
						hopZDepthOffsets[hop.direction as keyof typeof hopZDepthOffsets][
							zDepthOffsetIndex
						]
				}
				if (hop.z !== 0) {
					// Raise or lower sprite while hopping up/down
					const yOffsets = hop.z > 0 ? hopUpYOffsets : hopDownYOffsets
					const yOffsetIndex = yOffsets.frames.indexOf(hop.frame)
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
	if (hop.direction === 'east') sprite.texture = 'cube:0'
	else if (hop.direction === 'south') sprite.texture = 'cube:1'
	else sprite.texture = 'cube:2'
}
