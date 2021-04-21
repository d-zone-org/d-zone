import * as PIXI from 'pixi.js-legacy'

export const RENDER_SETTINGS = {
	resolution: window.devicePixelRatio,
	scaleMode: PIXI.SCALE_MODES.NEAREST,
	autoDensity: true,
}

export const BACKGROUND_COLOR = 0xffffff as const

export const ZOOM_OPTIONS = {
	smoothing: 3,
	levels: [0.25, 1, 2, 3, 4, 5, 6, 8],
	defaultLevel: 2,
} as const

export const PANNING_FRICTION = 0.8 as const
