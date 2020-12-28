import { Entity, Query, System } from 'ape-ecs'
import Hop from '../components/hop'
import Animation from '../components/animation'
import Transform from '../components/transform'
import Draw from '../components/draw'
import Texture from '../components/texture'
// import Graphic from '../components/graphic'
import Map from '../components/map'
import {
	SPRITE_DEFINITIONS,
	HOP_OFFSETS,
	HOP_TICKS_PER_FRAME,
} from '../../config/sprite'
import { Animations, Direction, ITexture } from '../../typings'
import { getValidHop } from '../archetypes/actor'
import Map3D from '../../common/map-3d'
import { Tags } from '../'

export default class HopSystem extends System {
	private animations!: Record<string, ITexture[]>
	private hopQuery!: Query

	init(animations: Animations) {
		this.animations = this.buildAnimations(animations)
		this.hopQuery = this.createQuery({
			all: [Hop, Transform, Draw, Texture, Map],
			persist: true,
		})
	}

	update(/*tick: number*/) {
		this.hopQuery.execute().forEach((entity) => {
			const hop = entity.c[Hop.key] as Hop
			const map = entity.c[Map.key].map as Map3D<Entity>

			if (!hop.placeholder) {
				// Initialize new hop
				const actorGrid = map.getCellGrid(entity)
				if (!actorGrid) return console.error('Actor not found in map', entity)
				const validHop = getValidHop(actorGrid, hop, map)
				if (validHop) {
					hop.z = validHop.z
					entity.removeTag(Tags.Platform)
					const hopGrid = Map3D.addGrids(actorGrid, hop)
					hop.placeholder = this.world.createEntity({
						tags: [Tags.Solid],
						// c: {
						// 	[Graphic.key]: {
						// 		type: Graphic.typeName,
						// 		color: 0xaa0044,
						// 		width: 10,
						// 		height: 10,
						// 		anchorX: 5,
						// 		anchorY: 5,
						// 	},
						// 	[Transform.key]: {
						// 		type: Transform.typeName,
						// 		...hopGrid,
						// 	},
						// 	[Draw.key]: {
						// 		type: Draw.typeName,
						// 	},
						// },
					})
					map.addCellToGrid(hop.placeholder, hopGrid)
					// Create animation component
					let animationName = `hop-${hop.direction}`
					if (hop.z > 0) animationName += '-up'
					if (hop.z < 0) animationName += '-down'
					entity.addComponent({
						type: Animation.typeName,
						key: Animation.key,
						ticksPerFrame: HOP_TICKS_PER_FRAME,
						frames: this.animations[animationName],
					})
				} else {
					faceSpriteToDirection(entity.c[Texture.key] as Texture, hop.direction)
					entity.removeComponent(hop)
					return
				}
			}
			const animation = entity.c.animation as Animation | undefined
			if (!animation) {
				// Hop completed
				const transform = entity.c[Transform.key] as Transform
				const newGrid = Map3D.addGrids(transform, hop)
				transform.update(newGrid)
				map.moveCellToGrid(entity, newGrid)
				if (hop.placeholder) {
					map.removeCellFromGrid(hop.placeholder, newGrid)
					hop.placeholder.destroy()
				}
				faceSpriteToDirection(entity.c[Texture.key] as Texture, hop.direction)
				entity.addTag(Tags.Platform)
				entity.removeComponent(hop)
			} else if (hop.tick === 0 || animation.frame > hop.frame) {
				const draw = entity.c[Draw.key] as Draw
				hop.frame = animation.frame
				if (hop.tick === 0) {
					draw.update({
						zIndex: draw.zIndex + 0.01,
					})
				}
				const zDepthOffset = getZDepthOffset(hop.frame, hop.direction)
				if (zDepthOffset) {
					// Adjust z-depth while hopping
					draw.update({
						zIndex: draw.zIndex + zDepthOffset,
					})
				}
			}
			hop.tick++
		})
	}

	private buildAnimations(animations: Animations): HopSystem['animations'] {
		const hopAnimations: HopSystem['animations'] = {}
		for (const direction of Object.values(Direction)) {
			const baseName = `hop-${direction}`
			const { x: anchorX, y: anchorY } = SPRITE_DEFINITIONS[baseName].anchor
			hopAnimations[baseName] = animations[baseName].map((t) => {
				return { name: t.textureCacheIds[0], anchorX, anchorY }
			})
			for (const zVariant of ['up', 'down']) {
				let anchorYOffset = 0
				const { frames, values } =
					zVariant === 'up' ? HOP_OFFSETS.hopUpY : HOP_OFFSETS.hopDownY
				hopAnimations[`${baseName}-${zVariant}`] = animations[baseName].map(
					(t, i) => {
						const offsetIndex = frames.indexOf(i)
						if (offsetIndex >= 0) {
							anchorYOffset += values[offsetIndex]
						}
						return {
							name: t.textureCacheIds[0],
							anchorX,
							anchorY: anchorY - anchorYOffset,
						}
					}
				)
			}
		}
		return hopAnimations
	}
}

function faceSpriteToDirection(texture: Texture, direction: Direction) {
	texture.update({
		anchorX: SPRITE_DEFINITIONS.cube.anchor.x,
		anchorY: SPRITE_DEFINITIONS.cube.anchor.y,
		name: getCubeTexture(direction),
	})
}

function getCubeTexture(direction: Direction): string {
	switch (direction) {
		case Direction.East:
			return 'cube:0'
		case Direction.South:
			return 'cube:1'
		case Direction.North:
		case Direction.West:
			return 'cube:2'
	}
}

function getZDepthOffset(frame: number, direction: Direction): number {
	const frameIndex = HOP_OFFSETS.hopZDepth.frames.indexOf(frame)
	if (frameIndex >= 0) {
		return HOP_OFFSETS.hopZDepth[direction][frameIndex]
	} else {
		return 0
	}
}
