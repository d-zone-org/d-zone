import * as PIXI from 'pixi.js-legacy'
import { Viewport } from 'pixi-viewport'
import Cull from 'pixi-cull'

// Global PIXI settings
PIXI.settings.RESOLUTION = 1
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

export default class Renderer {
	app: PIXI.Application
	view: Viewport
	cull: any
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
		this.view.drag({ wheel: false }).pinch().decelerate({ friction: 0.8 })
		this.view.moveCenter(0, 0)
		this.view.scaled = 2
		this.view.on('zoomed-end', () => {
			console.log(this.view.scaled)
		})
		canvas.addEventListener(
			'wheel',
			(event) => {
				// Copied mostly from pixi-viewport wheel plugin
				let point = this.app.renderer.plugins.interaction.mouse.global
				let oldPoint = this.view.toLocal(point)
				let viewChanged = false
				if (event.deltaY < 0) {
					this.view.scaled++
					viewChanged = true
				} else if (event.deltaY > 0) {
					if (this.view.scaled > 1) {
						this.view.scaled--
						viewChanged = true
					}
				}
				let newPoint = this.view.toGlobal(oldPoint)
				if (viewChanged) {
					this.view.x += point.x - newPoint.x
					this.view.y += point.y - newPoint.y
				}
				event.preventDefault()
				return false
			},
			false
		)
		this.view.sortableChildren = true
		this.app.stage.addChild(this.view)
		this.cull = new Cull.SpatialHash()
		this.cull.addContainer(this.view)
		this.app.ticker.add(() => {
			if (this.view.dirty) {
				this.cull.cull(this.view.getVisibleBounds())
				this.view.dirty = false
			}
		})
	}
}
