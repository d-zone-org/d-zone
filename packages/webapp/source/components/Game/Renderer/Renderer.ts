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
		this.view
			.drag()
			.pinch() /*.wheel({ smooth: 10 })*/
			.decelerate({ friction: 0.8 })
		this.view.moveCenter(0, 0)
		this.view.scaled = 2
		this.view.on('zoomed-end', () => {
			console.log(this.view.scaled)
			// if (this.view.scaled < 1) return
			// if (this.view.scaled < 4) {
			// 	this.view.animate({ time: 100, scale: Math.round(this.view.scaled) })
			// }
		})
		canvas.addEventListener('mousewheel', (event) => {
			let newZoom = 0
			if (event.deltaY < 0) {
				if (this.view.scaled <= 1) newZoom = this.view.scaled * 2
				else newZoom = Math.round(this.view.scaled) + 1
			} else if (event.deltaY > 0) {
				if (this.view.scaled <= 1)
					newZoom = Math.max(0.13, this.view.scaled / 2)
				else newZoom = Math.round(this.view.scaled) - 1
			}
			if (newZoom === 0) console.log(event.deltaY, this.view.scaled)
			if (newZoom !== this.view.scaled)
				this.view.animate({
					time: 100,
					scale: newZoom,
				})
		})
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
