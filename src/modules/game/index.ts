import * as PIXI from 'pixi.js-legacy'
import Renderer from './renderer'
import Resources from './renderer/resources/resources'
import Engine from './engine'
import { Map3D } from './common/map'
import { registerECS } from './engine/register-ecs'
import { seedGame } from './engine/benchmark'

export default class Game {
	renderer = new Renderer()
	resources = new Resources()
	map = new Map3D()
	engine = new Engine()

	async init(canvas: HTMLCanvasElement) {
		// Initialize renderer with canvas
		this.renderer.init(canvas)
		console.log('Renderer created', this.renderer.app.stage)

		await this.resources.load()
		console.log('Resources loaded')

		// Register ECS components and systems
		registerECS(this.engine, this.renderer, this.resources, this.map)
		console.log('ECS world initialized!', this.engine.world)

		// Add placeholder content
		seedGame(this.engine)

		// Start update loop
		this.engine.start(60)
	}

	exit() {
		this.renderer.app.stop()
		this.engine.stop()
		PIXI.utils.clearTextureCache()
	}
}
