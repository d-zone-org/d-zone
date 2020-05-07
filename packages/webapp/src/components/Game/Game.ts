import { initRenderer } from './Renderer/Renderer'
import Engine from './Engine/Engine'

export async function initGame(canvas: HTMLCanvasElement) {
	await initRenderer(canvas)
	const engine: Engine = new Engine()
	engine.start()
}
