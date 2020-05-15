import Renderer from './Renderer/Renderer'
import Engine from './Engine/Engine'
import { addActors } from './Engine/Benchmark'

export async function initGame(canvas: HTMLCanvasElement) {
	const renderer: Renderer = new Renderer(canvas)
	await renderer.load()
	const engine: Engine = new Engine()
	engine.init(renderer)
	addActors(engine.world, 300) // Add 300 random actors
	engine.start(60) // Start update loop
}
