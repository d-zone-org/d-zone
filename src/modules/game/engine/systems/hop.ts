import { Query, System } from 'ape-ecs'
import Hop from '../components/hop'
import Transform from '../components/transform'
import Sprite from '../components/sprite'
import MapCell from '../components/map-cell'
import {
	HOP_UP_Y_OFFSETS,
	HOP_DOWN_Y_OFFSETS,
	HOP_Z_DEPTH_OFFSETS,
} from '../../config/sprite-config'
import { Animations, Direction } from '../../typings'

let hopFrameCount: number
const hopFrameRate = 2

export default class HopSystem extends System {
	private animations!: Animations
	private hopQuery!: Query

	init(animations: Animations) {
		this.animations = animations
		hopFrameCount = this.animations['hop-east'].length
		this.hopQuery = this.createQuery()
			.fromAll(Hop, Transform, Sprite, MapCell)
			.persist(true)
	}

	update(/*tick: number*/) {
		let needRefresh = false
		this.hopQuery.added.forEach((entity) => {
			const hop = entity.c.hop as Hop
			const actorCell = entity.c.mapCell.cell
			const target = actorCell.getHopTarget(hop)
			if (target) {
				actorCell.reserveTarget(target)
				actorCell.properties.platform = false
				Object.assign(hop, target)
			} else {
				faceSpriteToHop(entity.c.sprite as Sprite, hop)
				entity.removeComponent(hop)
				needRefresh = true
			}
		})
		// Refresh hop query if any hops were aborted
		if (needRefresh) this.hopQuery.refresh()

		// TODO: Hop system should not be handling animation, make an animation component & system
		this.hopQuery.execute().forEach((entity) => {
			const hop = entity.c.hop as Hop
			const frame = Math.floor(hopFrameCount * hop.progress)
			if (hop.progress >= 1) {
				const { x, y, z } = entity.c.transform
				entity.c.transform.update({
					x: x + hop.x,
					y: y + hop.y,
					z: z + hop.z,
				})
				faceSpriteToHop(entity.c.sprite as Sprite, hop)
				entity.c.mapCell.cell.properties.platform = true
				entity.removeComponent(hop)
			} else if (hop.progress === 0 || frame > hop.frame) {
				hop.frame = frame
				const sprite = entity.c.sprite
				sprite.update({
					texture: this.animations[getAnimationName(hop.direction)][hop.frame]
						.textureCacheIds[0],
				})
				if (hop.progress === 0) {
					sprite.update({
						zIndex: sprite.zIndex + 0.01,
					})
				}
				const zDepthOffsetIndex = HOP_Z_DEPTH_OFFSETS.frames.indexOf(hop.frame)
				if (zDepthOffsetIndex >= 0) {
					// Adjust z-depth while hopping
					sprite.update({
						zIndex:
							sprite.zIndex + getZDepthOffset(hop.direction)[zDepthOffsetIndex],
					})
				}
				if (hop.z !== 0) {
					// Raise or lower sprite while hopping up/down
					const yOffsets = hop.z > 0 ? HOP_UP_Y_OFFSETS : HOP_DOWN_Y_OFFSETS
					const yOffsetIndex = yOffsets.frames.indexOf(hop.frame)
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
		texture: getHopTexture(hop.direction),
	})
}

function getHopTexture(direction: Direction): string {
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

function getZDepthOffset(direction: Direction): number[] {
	switch (direction) {
		case Direction.East:
			return HOP_Z_DEPTH_OFFSETS.east
		case Direction.South:
			return HOP_Z_DEPTH_OFFSETS.south
		case Direction.North:
			return HOP_Z_DEPTH_OFFSETS.north
		case Direction.West:
			return HOP_Z_DEPTH_OFFSETS.west
	}
}

function getAnimationName(direction: Direction): string {
	switch (direction) {
		case Direction.East:
			return 'hop-east'
		case Direction.South:
			return 'hop-south'
		case Direction.North:
			return 'hop-north'
		case Direction.West:
			return 'hop-west'
	}
}
