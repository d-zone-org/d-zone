import ECS, { Entity } from 'ecs-lib'
import ActorEntity from './entities/ActorEntity'
import ActorSystem from './systems/ActorSystem'
import SpriteSystem from './systems/SpriteSystem'
import HopSystem from './systems/HopSystem'

import { randomString, randomColor, randomCoord } from './Benchmark'

export default class Engine {
	private readonly world: ECS

	constructor() {
		this.world = new ECS()
		console.log('ECS world created!', this.world)
	}

	private updateCount: number = 0
	private updateTimeSum: number = 0
	private countStartTime: number = 0

	private update() {
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

	start(): void {
		const actorSystem = new ActorSystem()
		const spriteSystem = new SpriteSystem()
		const hopSystem = new HopSystem()
		this.world.addSystem(actorSystem)
		this.world.addSystem(spriteSystem)
		this.world.addSystem(hopSystem)

		for (let i = 0; i < 300; i++) {
			let actorEntity: Entity = new ActorEntity(
				{
					userID: randomString([48, 57], 18),
					username: randomString([32, 126], Math.floor(Math.random() * 12) + 3),
					color: randomColor(),
				},
				{
					x: randomCoord(),
					y: randomCoord(),
					z: 0,
				})
			this.world.addEntity(actorEntity)
		}

		setInterval(() => this.update(), 1000 / 60) // Begin game loop
	}
}
