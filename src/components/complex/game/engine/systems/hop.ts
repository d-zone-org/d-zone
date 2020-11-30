import { Query, System } from 'ape-ecs'
import Hop from '../components/hop'
import Transform from '../components/transform'
import Sprite from '../components/sprite'
import MapCell from '../components/map-cell'
import {
	hopUpYOffsets,
	hopDownYOffsets,
	hopZDepthOffsets,
} from 'web/art/sprite-config.json'

let hopFrameCount: number
let hopFrameRate = 2

export default class HopSystem extends System {
	private animations: any
	private hopQuery!: Query

	init(resources: any) {
		this.animations = resources.sheet.spritesheet.animations
		hopFrameCount = this.animations['hop-east'].length
		this.hopQuery = this.createQuery()
			.fromAll(Hop, Transform, Sprite, MapCell)
			.persist(true)
	}

	update(_tick: number) {
		this.hopQuery.added.forEach((entity) => {
			let hop = entity.c.hop as Hop
			let actorCell = entity.c.mapCell.cell
			let target = actorCell.getHopTarget(hop)
			if (target) {
				actorCell.reserveTarget(target)
				actorCell.properties.platform = false
				Object.assign(hop, target)
			} else {
				faceSpriteToHop(entity.c.sprite as Sprite, hop)
				entity.removeComponent(typeof Hop)
			}
		})

		this.hopQuery.execute().forEach((entity) => {
			let hop = entity.c.hop as Hop
			let frame = Math.floor(hopFrameCount * hop.progress)
			if (hop.progress >= 1) {
				const { x, y, z } = entity.c.transform
				entity.c.transform.update({
					x: x + hop.x,
					y: y + hop.y,
					z: z + hop.z,
				})
				faceSpriteToHop(entity.c.sprite as Sprite, hop)
				entity.c.mapCell.cell.properties.platform = true
				entity.removeComponent(typeof Hop)
			} else if (hop.progress === 0 || frame > hop.frame) {
				hop.frame = frame
				const sprite = entity.c.sprite
				sprite.update({
					texture: this.animations[`hop-${hop.direction}`][hop.frame]
						.textureCacheIds[0],
				})
				if (hop.progress === 0) {
					sprite.update({
						zIndex: sprite.zIndex + 0.01,
					})
				}
				let zDepthOffsetIndex = hopZDepthOffsets.frames.indexOf(hop.frame)
				if (zDepthOffsetIndex >= 0) {
					// Adjust z-depth while hopping
					sprite.update({
						zIndex:
							sprite.zIndex +
							hopZDepthOffsets[hop.direction as direction][zDepthOffsetIndex],
					})
				}
				if (hop.z !== 0) {
					// Raise or lower sprite while hopping up/down
					let yOffsets = hop.z > 0 ? hopUpYOffsets : hopDownYOffsets
					let yOffsetIndex = yOffsets.frames.indexOf(hop.frame)
					if (yOffsetIndex >= 0) {
						sprite.update({
							y: sprite.y + yOffsets.values[yOffsetIndex],
						})
					}
				}
			}
			hop.progress += 1 / hopFrameCount / hopFrameRate
		})
	}
}

function faceSpriteToHop(sprite: Sprite, hop: Hop) {
	sprite.update({
		texture: hopDirectionTextures[hop.direction as direction],
	})
}

type direction = 'east' | 'west' | 'south' | 'north'
const hopDirectionTextures = {
	east: 'cube:0',
	south: 'cube:1',
	west: 'cube:2',
	north: 'cube:2',
}
