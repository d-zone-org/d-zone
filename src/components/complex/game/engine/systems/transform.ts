import { Query, System } from 'ape-ecs'
import Sprite from '../components/sprite'
import Transform from '../components/transform'
import { get2dCoordsFromIso, getZIndex } from '../../common/projection'

export default class TransformSystem extends System {
	private transformQuery!: Query
	init() {
		this.transformQuery = this.createQuery()
			.fromAll(Transform, Sprite)
			.persist(true)
	}
	update(tick: number) {
		let update = (entity: any) => {
			let { x, y, z } = entity.c.transform
			let [newX, newY] = get2dCoordsFromIso(x, y, z)
			entity.c.sprite.update({
				x: newX,
				y: newY,
				zIndex: getZIndex(x, y, z),
			})
		}
		this.transformQuery.added.forEach(update)
		this.transformQuery.execute({ updatedValues: tick })
	}
}
