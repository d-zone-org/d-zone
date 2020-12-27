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
				let frameNumber = Math.floor(animation.tick / animation.ticksPerFrame)
				if (frameNumber === animation.frames.length) {
					// End of animation reached
					if (animation.loop) {
						animation.update({
							ticks: 0,
						})
						frameNumber = 0
					} else {
						entity.removeComponent(animation)
						return
					}
				}
				const { anchorX, anchorY, name } = animation.frames[frameNumber]
				const texture = entity.c[Texture.key] as Texture
				texture.update({ anchorX, anchorY, name })
			}
			animation.update({
				tick: animation.tick + 1,
			})
		})
	}
}
