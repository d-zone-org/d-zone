import { World } from 'ape-ecs'

/**
 * Group names that ECS systems are registered under.
 *
 * @see {@link https://github.com/fritzy/ape-ecs/blob/master/docs/World.md#registersystem}
 */
export enum SystemGroup {
	/** The default group to register systems under. */
	Default = 'default',
}

/**
 * The manager for the ECS World instance.
 *
 * @see {@link https://github.com/fritzy/ape-ecs/blob/master/docs/World.md}
 */
export default class Engine {
	readonly world: World

	constructor() {
		this.world = new World()
	}

	/** The interval ID for the game loop. */
	private interval?: number

	/** The game loop that runs the ECS systems and ticks the world. */
	update() {
		this.world.runSystems(SystemGroup.Default)
		this.world.tick()
	}

	/**
	 * Starts the game loop
	 *
	 * @param fps - The target number of times per second to run the interval at.
	 * @remarks
	 * `setInterval` is used instead of `requestAnimationFrame`
	 *
	 *
	 *     because
	 *
	 *
	 *          we want all logic to run at a fixed rate.
	 */
	start(fps: number): void {
		this.interval = window.setInterval(() => this.update(), 1000 / fps)
	}

	/** Stops the game loop. */
	stop(): void {
		clearInterval(this.interval)
	}
}
