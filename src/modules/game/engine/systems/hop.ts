import { Entity, Query, System } from 'ape-ecs'
import Hop from '../components/hop'
import Animation from '../components/animation'
import Transform from '../components/transform'
import Draw from '../components/draw'
import Texture from '../components/texture'
// import Graphic from '../components/graphic'
import Map from '../components/map'
import { HOP_OFFSETS } from '../../config/sprite'
import { Animations, ITexture } from '../../typings'
import {
	addHopAnimationComponent,
	getDirectionalCubeTexture,
	getValidHop,
} from '../archetypes/actor'
import Map3D from '../../common/map-3d'
import { Tags } from '../'

export default class HopSystem extends System {
	private animations!: Record<string, ITexture[]>
	private hopQuery!: Query

	init(animations: Animations) {
		this.animations = animations
		this.hopQuery = this.createQuery({
			all: [Hop, Transform, Draw, Texture, Map],
			persist: true,
		})
	}

	update(/*tick: number*/) {
		this.hopQuery.execute().forEach((entity) => {
			const hop = entity.c[Hop.key] as Hop
			const map = entity.c[Map.key].map as Map3D<Entity>
			const texture = entity.c[Texture.key] as Texture
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
						// 	[Transform.key]: { type: Transform.typeName, ...hopGrid },
						// 	[Draw.key]: { type: Draw.typeName },
						// },
					})
					map.addCellToGrid(hop.placeholder, hopGrid)
					// Add animation component
					addHopAnimationComponent(entity, hop, this.animations)
				} else {
					texture.update(getDirectionalCubeTexture(hop.direction))
					entity.removeComponent(hop)
					return
				}
			}
			const animation = entity.c.animation as Animation | undefined
			if (!animation) {
				// Hop completed
				const transform = entity.c[Transform.key] as Transform
				// Update transform and map
				const newGrid = Map3D.addGrids(transform, hop)
				transform.update(newGrid)
				map.moveCellToGrid(entity, newGrid)
				if (hop.placeholder) {
					map.removeCellFromGrid(hop.placeholder, newGrid)
					hop.placeholder.destroy()
				}
				entity.addTag(Tags.Platform)
				texture.update(getDirectionalCubeTexture(hop.direction))
				entity.removeComponent(hop)
			} else if (hop.tick === 0 || animation.frame > hop.frame) {
				const draw = entity.c[Draw.key] as Draw
				hop.frame = animation.frame
				if (hop.tick === 0) {
					draw.update({
						zIndex: draw.zIndex + 0.01,
					})
				}
				// Adjust z-depth while hopping
				const hopZDepthIndex = HOP_OFFSETS.hopZDepth.frames.indexOf(hop.frame)
				if (hopZDepthIndex >= 0) {
					draw.update({
						zIndex:
							draw.zIndex +
							HOP_OFFSETS.hopZDepth[hop.direction][hopZDepthIndex],
					})
				}
			}
			hop.tick++
		})
	}
}
