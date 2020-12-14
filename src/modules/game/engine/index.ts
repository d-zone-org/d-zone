import { World } from 'ape-ecs'

export enum SystemGroup {
	Default = 'default',
}

export default class Engine {
	readonly world: World

	constructor() {
		this.world = new World()
	}

	private interval?: number

	update() {
		this.world.runSystems(SystemGroup.Default)
		this.world.tick()
	}

	start(fps: number): void {
		// Begin game loop
		this.interval = window.setInterval(() => this.update(), 1000 / fps)
	}

	stop(): void {
		clearInterval(this.interval)
	}
}
