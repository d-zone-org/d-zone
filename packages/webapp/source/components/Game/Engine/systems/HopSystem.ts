import { Attributes, System } from 'ecsy'
import Hop from '../components/Hop'
import Transform from '../components/Transform'
import Sprite from '../components/Sprite'

let hopFrameCount: number

export default class HopSystem extends System {
	private animations: any
	init(attributes: Attributes) {
		this.animations = attributes.resources.sheet.spritesheet.animations
		hopFrameCount = this.animations['hop-east'].length
	}
	execute(_delta: number, _time: number) {
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
				let sprite = entity.getMutableComponent(Sprite)!
				if (hop.direction === 'east') sprite.texture = 'cube:0'
				else if (hop.direction === 'south') sprite.texture = 'cube:1'
				else sprite.texture = 'cube:2'
				entity.removeComponent(Hop)
				return
			} else if (hop.progress === 0 || frame > hop.frame) {
				hop.frame = frame
				let sprite = entity.getMutableComponent(Sprite)!
				sprite.texture = this.animations[`hop-${hop.direction}`][
					hop.frame
				].textureCacheIds[0]
			}
			hop.progress += 1 / (hopFrameCount * 2)
		}
	}
}
HopSystem.queries = {
	hopping: { components: [Hop, Transform, Sprite] },
}
