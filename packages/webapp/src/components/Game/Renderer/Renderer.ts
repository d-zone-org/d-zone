import * as PIXI from 'pixi.js'
import Resources from './Resources/Resources'

// Global PIXI settings
PIXI.settings.RESOLUTION = window.devicePixelRatio
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

export default class Renderer {
	app: PIXI.Application
	resources: Resources
	constructor(canvas: HTMLCanvasElement) {
		this.app = new PIXI.Application({
			width: 800,
			height: 600,
			backgroundColor: 0x1d171f,
			view: canvas,
		})
		this.app.stage.sortableChildren = true
		this.resources = new Resources()
	}

	async load() {
		await this.resources.load()
	}
}
