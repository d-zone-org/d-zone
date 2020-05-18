import ECS, { System } from 'ecs-lib'

export default class Engine {
	readonly world: ECS

	constructor() {
		this.world = new ECS()
	}

	init(systems: System[]) {
		systems.forEach((system) => this.world.addSystem(system))
		console.log('ECS world initialized!', this.world)
	}

	private interval: number | undefined
	private updateCount: number = 0
	private updateTimeSum: number = 0
	private countStartTime: number = 0

	update() {
		// if (this.updateCount % 200 === 0) {
		// 	this.countStartTime = performance.now();
		// }
		// let preUpdateTime = performance.now();
		this.world.update()
		this.updateCount++
		// let now = performance.now();
		// this.updateTimeSum += now - preUpdateTime;
		// if (this.updateCount % 200 === 0) {
		// 	console.log(this.updateCount, 'FPS:', 200 / ((now - this.countStartTime) / 1000),
		// 		'MS per frame:', this.updateTimeSum / 200);
		// 	this.updateTimeSum = 0;
		// }
	}

	start(fps: number): void {
		// Begin game loop
		this.interval = setInterval(() => this.update(), 1000 / fps)
	}

	stop(): void {
		clearInterval(this.interval)
	}
}
