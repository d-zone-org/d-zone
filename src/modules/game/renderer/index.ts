import * as PIXI from 'pixi.js-legacy'
import { SpatialHash } from 'pixi-cull'
import { Viewport, BuiltInPlugins } from 'pixi-viewport'
import WheelStepped from './wheel-stepped'
import {
	RENDER_SETTINGS,
	BACKGROUND_COLOR,
	ZOOM_OPTIONS,
	PANNING_FRICTION,
} from '../config/renderer'

export interface Plugins extends BuiltInPlugins {
	'wheel-stepped': WheelStepped
}

// Global PIXI settings
PIXI.settings.RESOLUTION = RENDER_SETTINGS.resolution
PIXI.settings.SCALE_MODE = RENDER_SETTINGS.scaleMode

export default class Renderer {
	app!: PIXI.Application
	view!: Viewport<Plugins>
	cull!: SpatialHash

	init(canvas: HTMLCanvasElement) {
		this.app = new PIXI.Application({
			backgroundColor: BACKGROUND_COLOR,
			view: canvas,
		})

		this.view = new Viewport({
			screenWidth: this.app.view.offsetWidth,
			screenHeight: this.app.view.offsetHeight,
			interaction: this.app.renderer.plugins.interaction,
		})

		this.view.plugins.add(
			'wheel-stepped',
			new WheelStepped(this.view, {
				smooth: ZOOM_OPTIONS.smoothing,
				steps: ZOOM_OPTIONS.levels,
			}),
			0
		)

		this.view
			.drag({ wheel: false })
			.pinch()
			.decelerate({ friction: PANNING_FRICTION })
			.clampZoom({
				minScale: ZOOM_OPTIONS.levels[0],
				maxScale: ZOOM_OPTIONS.levels[ZOOM_OPTIONS.levels.length - 1],
			})

		this.view.moveCenter(0, 0)
		this.view.scaled = ZOOM_OPTIONS.defaultLevel
		this.view.sortableChildren = true

		this.app.stage.addChild(this.view)

		canvas.addEventListener('wheel', (event) => {
			event.preventDefault()
		})

		this.cull = new SpatialHash()
		this.cull.addContainer(this.view)

		this.app.ticker.add(() => {
			if (this.view.dirty) {
				this.view.x = Math.round(this.view.x)
				this.view.y = Math.round(this.view.y)
				this.cull.cull(this.view.getVisibleBounds())
				this.view.dirty = false
			}
		})
	}

	stop() {
		this.app.stop()
		PIXI.utils.clearTextureCache()
	}
}
