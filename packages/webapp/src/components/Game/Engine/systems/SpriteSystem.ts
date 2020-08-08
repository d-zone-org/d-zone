import { System } from 'ecsy'
import SpriteComponent from '../components/SpriteComponent'

export default class SpriteSystem extends System {
	execute(_delta: number, _time: number) {
		this.queries.sprites.results.forEach((entity) => {
			console.log(entity)
		})
	}
}
SpriteSystem.queries = {
	sprites: { components: [SpriteComponent] },
}
