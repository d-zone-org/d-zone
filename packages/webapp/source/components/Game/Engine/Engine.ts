import { World } from 'ecsy'

export default class Engine {
	readonly world: World

	constructor() {
		this.world = new World()
	}

	private interval: number | undefined
	private tick = 0

	update(): void {
		this.world.execute(this.interval, this.tick++)
	}

	start(fps: number): void {
		// Begin game loop
		this.interval = setInterval(() => this.update(), 1000 / fps)
	}

	stop(): void {
		clearInterval(this.interval)
	}
}
