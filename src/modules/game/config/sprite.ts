import type { ISpriteDefinition } from '../typings'

export const SPRITE_JSON_PATH = './img/sprites.json' as const

/** Sprite data used to configure PIXI textures in [[loader]]. */
export const SPRITE_DEFINITIONS: Record<string, ISpriteDefinition> = {
	cube: { w: 14, h: 14, anchor: { x: 7, y: 7 } },
	'cube-idle': { w: 14, h: 14, anchor: { x: 7, y: 7 } },
	'cube-off': { w: 14, h: 14, anchor: { x: 7, y: 7 } },
	'talk-right': { w: 14, h: 14, anchor: { x: 7, y: 7 }, animation: true },
	'talk-left': { w: 14, h: 14, anchor: { x: 7, y: 7 }, animation: true },
	'hop-west': { w: 35, h: 27, anchor: { x: 26, y: 18 }, animation: true },
	'hop-north': { w: 35, h: 27, anchor: { x: 9, y: 18 }, animation: true },
	'hop-east': { w: 35, h: 25, anchor: { x: 9, y: 9 }, animation: true },
	'hop-south': { w: 35, h: 25, anchor: { x: 26, y: 9 }, animation: true },
	'brick-edge': { w: 32, h: 16, anchor: { x: 0, y: 0 } },
	'grass-brick': { w: 32, h: 16, anchor: { x: 0, y: 0 } },
	flowers: { w: 32, h: 16, anchor: { x: 0, y: 0 } },
	grass: { w: 32, h: 16, anchor: { x: 0, y: 0 } },
	beacon: { w: 31, h: 56, anchor: { x: 0, y: 0 } },
} as const

/**
 * Sprite Y coordinate and z-index offsets to apply at specified frames during
 * hop animations.
 */
export const HOP_OFFSETS = {
	hopUpY: {
		frames: [4, 6, 7, 8, 9],
		values: [-1, -1, -1, -2, -3],
	},
	hopDownY: {
		frames: [4, 5, 6, 7, 8, 9],
		values: [1, 1, 2, 1, 2, 1],
	},
	hopZDepth: {
		frames: [6, 9],
		north: [-0.5, -0.5],
		west: [-0.5, -0.5],
		south: [0.5, 0.5],
		east: [0.5, 0.5],
	},
}

/** Number of game ticks per frame of hop animation. */
export const HOP_FRAMERATE = 2 as const
