import Renderer from './renderer'
import Resources from './resources'
import Engine from './engine'
import Map3D from './common/map-3d'
import { registerECS } from './engine/register-ecs'
import { seedGame } from './engine/seed-dev'
import type { Entity } from 'ape-ecs'

const TICKS_PER_SECOND = 60

export default class Game {
	renderer = new Renderer()
	resources = new Resources()
	map = new Map3D<Entity>()
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

		// Create placeholder activity
		seedGame(this.engine.world, this.map)

		// Start update loop
		this.engine.start(TICKS_PER_SECOND)
	}

	exit() {
		this.renderer.stop()
		this.engine.stop()
	}
}
