import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'

// Global PIXI settings
PIXI.settings.RESOLUTION = 1
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

export default class Renderer {
	app: PIXI.Application
	view: Viewport
	constructor(canvas: HTMLCanvasElement) {
		this.app = new PIXI.Application({
			backgroundColor: 0x1d171f,
			view: canvas,
		})
		this.view = new Viewport({
			screenWidth: this.app.view.offsetWidth,
			screenHeight: this.app.view.offsetHeight,
			interaction: this.app.renderer.plugins.interaction,
		})
		this.view.drag().pinch().wheel().decelerate()
		this.view.moveCenter(0, 0)
		this.app.stage.addChild(this.view)
		this.app.stage.sortableChildren = true
	}
}
