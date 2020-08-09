import PIXI from 'es/pixi'

// Global PIXI settings
PIXI.settings.RESOLUTION = window.devicePixelRatio
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

export default class Renderer {
	app: PIXI.Application
	constructor(canvas: HTMLCanvasElement) {
		this.app = new PIXI.Application({
			width: 800,
			height: 600,
			backgroundColor: 0x1d171f,
			view: canvas,
		})
		this.app.stage.sortableChildren = true
		this.app.stage.setTransform(this.app.view.width / 2, 0) // Center on 0, 0
	}
}
