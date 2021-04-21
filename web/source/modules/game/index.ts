import type { Entity } from 'ape-ecs'
import { IUser } from 'server/dist/typings/payload'
import { BrowserLogger } from '../utils/logger'
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
	private readonly logger = new BrowserLogger('Game')

	// Development
	interactions = new Interactions()
	engine = new Engine()

	public async init(canvas: HTMLCanvasElement) {
		// Initialize renderer with canvas
		this.renderer.init(canvas)
		this.logger.log('Renderer created', this.renderer.app.stage)

		await this.resources.load()
		this.logger.log('Resources loaded')

		// Register ECS components and systems
		registerECS(this.engine, this.renderer, this.resources)
		this.logger.log('ECS world initialized!', this.engine.world)

		// Create placeholder activity
		// seedGame(this.engine.world, this.map)

		// Initialize interactions manager
		this.interactions.init(this.engine.world, this.map)
		this.logger.log('Interactions initialized', this.interactions)

		// Start update loop
		this.engine.start(TICKS_PER_SECOND)
	}

	addUsers(users: IUser[]) {
		this.logger.log('Creating actors from user list')
		users.forEach((_, i) =>
			setTimeout(() => this.interactions.addActor(), i * 200)
		)
	}

	exit() {
		this.logger.log('Shutting down game')
		this.renderer.stop()
		this.engine.stop()
	}
}
