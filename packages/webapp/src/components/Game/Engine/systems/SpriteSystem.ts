import { System } from 'ecsy'
import Sprite from '../components/Sprite'

export default class SpriteSystem extends System {
	execute(_delta: number, _time: number) {
		this.queries.sprites.results.forEach((_entity) => {
			// let sprite = entity.getComponent!(Sprite)
		})
	}
}
SpriteSystem.queries = {
	sprites: { components: [Sprite] },
}
