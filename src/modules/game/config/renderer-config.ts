import * as PIXI from 'pixi.js-legacy'

export const RENDER_SETTINGS = {
	resolution: 1,
	scaleMode: PIXI.SCALE_MODES.NEAREST,
}

export const BACKGROUND_COLOR = 0x1d171f as const

export const ZOOM_OPTIONS = {
	smoothing: 3,
	levels: [0.25, 0.5, 1, 2, 3, 4, 5, 6, 8],
	default_level: 1,
} as const

export const PANNING_FRICTION = 0.8 as const
