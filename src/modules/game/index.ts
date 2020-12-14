import Renderer from './renderer'
import Resources from './renderer/resources/resources'
import Engine from './engine'
import Map3D from './common/map-3d'
import { registerECS } from './engine/register-ecs'
import { seedGame } from './engine/seed-dev'

const FPS = 60

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
		registerECS(this.engine, this.renderer, this.resources)
		console.log('ECS world initialized!', this.engine.world)

		// Add placeholder content
		seedGame(this.engine, this.map)

		// Start update loop
		this.engine.start(FPS)
	}

	exit() {
		this.renderer.stop()
		this.engine.stop()
	}
}
