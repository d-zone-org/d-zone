import { World, SystemConstructor, ComponentConstructor } from 'ecsy'

export default class Engine {
	readonly world: World

	constructor() {
		this.world = new World()
	}

	init(
		systems: SystemConstructor<any>[],
		components: ComponentConstructor<any>[]
	) {
		components.forEach((component) => this.world.registerComponent(component))
		systems.forEach((system) => this.world.registerSystem(system))
		console.log('ECSY world initialized!', this.world)
	}

	private interval: number | undefined

	update() {
		this.world.execute()
	}

	start(fps: number): void {
		// Begin game loop
		this.interval = setInterval(() => this.update(), 1000 / fps)
	}

	stop(): void {
		clearInterval(this.interval)
	}
}
