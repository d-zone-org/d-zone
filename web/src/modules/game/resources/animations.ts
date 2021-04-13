import { Animations, Direction, Sheet } from 'root/modules/game/typings'
import {
	HOP_OFFSETS,
	SPRITE_DEFINITIONS,
} from 'root/modules/game/config/sprite'

/**
 * Transforms PIXI texture arrays into [[ITexture]] arrays used for [[Animation.frames]].
 *
 * @param pixiAnimations - Object containing PIXI texture arrays.
 * @returns - An object keyed by animation name with [[ITexture]] arrays.
 */
export function buildAnimations(
	pixiAnimations: Sheet['spritesheet']['animations']
): Animations {
	const animations: Animations = {}
	// Build hop animations
	for (const direction of Object.values(Direction)) {
		const hopSpriteName = `hop-${direction}`
		const { x: anchorX, y: anchorY } = SPRITE_DEFINITIONS[hopSpriteName].anchor
		animations[hopSpriteName] = pixiAnimations[hopSpriteName].map((t) => {
			return { name: t.textureCacheIds[0], anchorX, anchorY }
		})
		// Build hop up/down animations
		for (const zVariant of ['up', 'down']) {
			let anchorYOffset = 0
			const { frames, values } =
				zVariant === 'up' ? HOP_OFFSETS.hopUpY : HOP_OFFSETS.hopDownY
			animations[`${hopSpriteName}-${zVariant}`] = pixiAnimations[
				hopSpriteName
			].map((t, i) => {
				const offsetIndex = frames.indexOf(i)
				if (offsetIndex >= 0) {
					anchorYOffset += values[offsetIndex]
				}
				return {
					name: t.textureCacheIds[0],
					anchorX,
					anchorY: anchorY - anchorYOffset,
				}
			})
		}
	}
	// Build talk animations
	for (const talkDirection of ['talk-left', 'talk-right']) {
		const { x: anchorX, y: anchorY } = SPRITE_DEFINITIONS[talkDirection].anchor
		animations[talkDirection] = pixiAnimations[talkDirection].map((t) => {
			return { name: t.textureCacheIds[0], anchorX, anchorY }
		})
	}
	return animations
}
