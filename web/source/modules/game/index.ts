import type { Entity } from 'ape-ecs'
import Map3D from './common/map-3d'
import Engine from './engine'
import Interactions from './engine/interactions'
import { registerECS } from './engine/register-ecs'
import Renderer from './renderer'
import Resources from './resources'

const TICKS_PER_SECOND = 60

export class Game {
	private readonly renderer = new Renderer()
	private readonly resources = new Resources()
	private readonly map = new Map3D<Entity>()

	// Development
	interactions = new Interactions()
	engine = new Engine()

	public async init(canvas: HTMLCanvasElement) {
		// Initialize renderer with canvas
		this.renderer.init(canvas)
		console.log('Renderer created', this.renderer.app.stage)

		await this.resources.load()
		console.log('Resources loaded')

		// Register ECS components and systems
		registerECS(this.engine, this.renderer, this.resources)
		console.log('ECS world initialized!', this.engine.world)

		// Create placeholder activity
		// seedGame(this.engine.world, this.map)

		// Initialize interactions manager
		this.interactions.init(this.engine.world, this.map)
		console.log('Interactions initialized', this.interactions)

		// Start update loop
		this.engine.start(TICKS_PER_SECOND)
	}

	addUsers(users: {}[]) {
		console.log('Creating actors from user list')
		users.forEach((_, i) =>
			setTimeout(() => this.interactions.addActor(), i * 200)
		)
	}

	exit() {
		console.log('Shutting down game')
		this.renderer.stop()
		this.engine.stop()
	}
}
