import * as PIXI from 'pixi.js-legacy'
import { SpatialHash } from 'pixi-cull'
import { Viewport } from 'pixi-viewport'
import WheelStepped from './wheel-stepped'
import {
	RENDER_SETTINGS,
	BACKGROUND_COLOR,
	ZOOM_OPTIONS,
	PANNING_FRICTION,
} from '../config/renderer'

// Global PIXI settings
PIXI.settings.RESOLUTION = RENDER_SETTINGS.resolution
PIXI.settings.SCALE_MODE = RENDER_SETTINGS.scaleMode
PIXI.settings.RENDER_OPTIONS.autoDensity = RENDER_SETTINGS.autoDensity

/** A manager for the PIXI renderer and related plugins. */
export default class Renderer {
	/** The PIXI application itself */
	app!: PIXI.Application
	/** The viewport container which manages camera movement. */
<<<<<<< HEAD:src/modules/game/renderer/index.ts
	view!: Viewport<IPlugins>
=======
	view!: Viewport
>>>>>>> feat/comms:web/src/modules/game/renderer/index.ts
	/** The culler which prevents off-camera objects from rendering. */
	cull!: SpatialHash

	init(canvas: HTMLCanvasElement) {
		this.app = new PIXI.Application({
			backgroundColor: BACKGROUND_COLOR,
			resizeTo: window,
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
			.drag({ wheel: false }) // Click and hold or touch to pan the camera
			.pinch() // Pinch to zoom
			.decelerate({ friction: PANNING_FRICTION }) // Add easing to camera movements
			.clampZoom({
				// Set a minimum and maximum zoom amount
				minScale: ZOOM_OPTIONS.levels[0],
				maxScale: ZOOM_OPTIONS.levels[ZOOM_OPTIONS.levels.length - 1],
			})

		this.view.moveCenter(0, 0)
		this.view.scaled = ZOOM_OPTIONS.defaultLevel
		this.view.sortableChildren = true // Enables use of the zIndex property to draw sprites in the correct order

		this.app.stage.addChild(this.view)

		canvas.addEventListener('wheel', (event) => {
			event.preventDefault() // Disable default mouse wheel behavior
		})

		window.onresize = () => {
			this.app.resize()
			this.view.screenWidth = this.app.screen.width
			this.view.screenHeight = this.app.screen.height
			this.view.moveCenter(0, 0)
		}

		this.cull = new SpatialHash()
		this.cull.addContainer(this.view) // Culling occurs on the viewport container

		this.app.ticker.add(() => {
			// Whenever the camera changes
			if (this.view.dirty) {
				// Adjust the viewport to the nearest whole pixel
				this.view.x = Math.round(this.view.x)
				this.view.y = Math.round(this.view.y)
				// Cull the sprites in the viewport
				this.cull.cull(this.view.getVisibleBounds())
				this.view.dirty = false
			}
		})
	}

	stop() {
		this.app.stop()
		PIXI.utils.clearTextureCache() // Required for fast-refresh during dev
	}
}
