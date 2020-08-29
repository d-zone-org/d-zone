import { Attributes, System } from 'ecsy'
import Hop from '../components/Hop'
import Transform from '../components/Transform'
import Sprite from '../components/Sprite'
import MapCell from '../components/MapCell'
import ActorCell from '../../Common/ActorCell'
import {
	hopUpOffsets,
	hopDownOffsets,
} from '../../../../art/sprite-config.json'

let hopFrameCount: number

export default class HopSystem extends System {
	private animations: any
	init(attributes: Attributes) {
		this.animations = attributes.resources.sheet.spritesheet.animations
		hopFrameCount = this.animations['hop-east'].length
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
				entity.getMutableComponent(MapCell)!.value.properties.platform = true
				entity.removeComponent(Hop)
			} else if (hop.progress === 0 || frame > hop.frame) {
				hop.frame = frame
				let sprite = entity.getMutableComponent(Sprite)!
				sprite.texture = this.animations[`hop-${hop.direction}`][
					hop.frame
				].textureCacheIds[0]
				if (hop.z !== 0) {
					let offsets = hop.z > 0 ? hopUpOffsets : hopDownOffsets
					let offsetIndex = offsets.yFrames.indexOf(hop.frame)
					if (offsetIndex >= 0) sprite.y += offsets.yValues[offsetIndex]
				}
			}
			hop.progress += 1 / (hopFrameCount * 2)
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
