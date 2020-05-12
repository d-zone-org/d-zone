import ECS from 'ecs-lib'
import ActorSystem from './systems/ActorSystem'
import HopSystem from './systems/HopSystem'
import TransformSystem from './systems/TransformSystem'
import SpriteSystem from './systems/SpriteSystem'
import Renderer from '../Renderer/Renderer'

export default class Engine {
	readonly world: ECS

	constructor() {
		this.world = new ECS()
		console.log('ECS world created!', this.world)
	}

	init(renderer: Renderer) {
		const actorSystem = new ActorSystem()
		const hopSystem = new HopSystem()
		const transformSystem = new TransformSystem()
		const spriteSystem = new SpriteSystem(
			renderer.pushSpritesToRenderer.bind(renderer)
		)
		this.world.addSystem(actorSystem)
		this.world.addSystem(hopSystem)
		this.world.addSystem(transformSystem)
		this.world.addSystem(spriteSystem)
	}

	private interval: number | undefined
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

	start(fps: number): void {
		// Begin game loop
		this.interval = setInterval(() => this.update(), 1000 / fps)
	}

	stop(): void {
		clearInterval(this.interval)
	}
}
