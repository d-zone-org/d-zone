import Renderer from './renderer/renderer'
import Resources from './renderer/resources/resources'
import Engine from './engine'
import { Map3D } from './common/map'
import { registerECS } from './engine/register-ecs'
import { seedGame } from './engine/benchmark'

export default class Game {
	renderer: Renderer
	resources: Resources
	map: Map3D
	engine: Engine
	constructor(canvas: HTMLCanvasElement) {
		// Create renderer
		this.renderer = new Renderer(canvas)
		console.log('Renderer created', this.renderer.app.stage)

		this.resources = new Resources()
		this.map = new Map3D()
		this.engine = new Engine()

		this.init().catch(console.error)
	}

	async init() {
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
}
