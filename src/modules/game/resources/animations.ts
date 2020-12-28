import { Animations, Direction, Sheet } from 'web/modules/game/typings'
import { HOP_OFFSETS, SPRITE_DEFINITIONS } from 'web/modules/game/config/sprite'

/**
 * Transforms PIXI texture arrays into [[ITexture]] arrays used for [[Animation.frames]].
 *
 * @param animations - Object containing PIXI texture arrays.
 * @returns - An object keyed by animation name with [[ITexture]] arrays.
 */
export function buildAnimations(
	animations: Sheet['spritesheet']['animations']
): Animations {
	const hopAnimations: Animations = {}
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
