import { System } from 'ecsy'
import Hop from '../components/Hop'
import Transform from '../components/Transform'
import Sprite from '../components/Sprite'

export default class HopSystem extends System {
	execute(_delta: number, _time: number) {
		let hopping = this.queries.hopping.results
		for (let i = hopping.length - 1; i >= 0; i--) {
			let entity = hopping[i]
			let hop = entity.getMutableComponent!(Hop)
			if (hop.progress >= 1) {
				let transform = entity.getMutableComponent!(Transform)
				transform.x += hop.x
				transform.y += hop.y
				transform.z += hop.z
				entity.removeComponent(Hop)
				let sprite = entity.getMutableComponent!(Sprite)
				if (hop.x > 0) sprite.spriteName = 'cube:0'
				else if (hop.y > 0) sprite.spriteName = 'cube:1'
				else sprite.spriteName = 'cube:2'
				return
			}
			hop.progress += 1 / 30
		}
	}
}
HopSystem.queries = {
	hopping: { components: [Hop, Transform, Sprite] },
}
