// import Renderer from './Renderer/Renderer'
import Engine from './Engine/Engine'
// import { addActors } from './Engine/Benchmark'
// import ActorSystem from './Engine/systems/ActorSystem'
// import HopSystem from './Engine/systems/HopSystem'
// import TransformSystem from './Engine/systems/TransformSystem'
import SpriteSystem from './Engine/systems/SpriteSystem'
import SpriteComponent from './Engine/components/SpriteComponent'

export async function initGame(/*canvas: HTMLCanvasElement*/) {
	// const renderer: Renderer = new Renderer(canvas)
	// await renderer.load()
	const engine: Engine = new Engine()
	engine.init([SpriteSystem], [SpriteComponent])
	// addActors(engine.world, 300) // Add 300 random actors
	engine.start(60) // Start update loop
}
