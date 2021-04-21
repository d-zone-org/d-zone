import { Query, System } from 'ape-ecs'
import Animation from '../components/animation'
import Texture from '../components/texture'

export default class AnimationSystem extends System {
	private animationQuery!: Query
	init() {
		this.animationQuery = this.createQuery({
			all: [Animation, Texture],
			persist: true,
		})
	}

	update(/*tick: number*/) {
		this.animationQuery.execute().forEach((entity) => {
			const animation = entity.c[Animation.key] as Animation
			if (animation.paused) return
			if (animation.tick % animation.ticksPerFrame === 0) {
				// Next frame of animation
				animation.frame = Math.floor(animation.tick / animation.ticksPerFrame)
				if (animation.frame === animation.frames.length) {
					// End of animation reached
					if (animation.loop) {
						animation.tick = 0
						animation.frame = 0
					} else {
						entity.removeComponent(animation)
						return
					}
				}
				const { anchorX, anchorY, name } = animation.frames[animation.frame]
				const texture = entity.c[Texture.key] as Texture
				texture.update({ anchorX, anchorY, name })
			}
			animation.update({
				tick: animation.tick + 1,
			})
		})
	}
}
