import Renderer from './Renderer/Renderer'
import Resources from './Renderer/Resources/Resources'
import Engine from './Engine/Engine'
import { Map3D } from './Common/Map'
import { addActors, hopActor } from './Engine/Benchmark'
import Sprite from './Engine/components/Sprite'
import PixiSprite from './Engine/components/PixiSprite'
import Transform from './Engine/components/Transform'
import Actor from './Engine/components/Actor'
import Hop from './Engine/components/Hop'
import MapCell from './Engine/components/MapCell'
import HopSystem from './Engine/systems/HopSystem'
import MapSystem from './Engine/systems/MapSystem'
import TransformSystem from './Engine/systems/TransformSystem'
import SpriteSystem from './Engine/systems/SpriteSystem'

export async function initGame(canvas: HTMLCanvasElement) {
	const renderer: Renderer = new Renderer(canvas)
	console.log('Renderer created', renderer.app.stage)
	const resources = new Resources()
	await resources.load()
	const engine: Engine = new Engine()
	const map: Map3D = new Map3D()
	engine.world.registerComponent(Sprite)
	engine.world.registerComponent(Transform)
	engine.world.registerComponent(Actor)
	engine.world.registerComponent(Hop)
	engine.world.registerComponent(MapCell)
	engine.world.registerComponent(PixiSprite, false) // Do not pool
	engine.world.registerSystem(HopSystem, { resources })
	engine.world.registerSystem(MapSystem, { map })
	engine.world.registerSystem(TransformSystem)
	engine.world.registerSystem(SpriteSystem, { resources, renderer })
	console.log('ECSY world initialized!', engine.world)
	let actors = addActors(engine.world, 100)
	setInterval(() => {
		hopActor(actors[Math.floor(Math.random() * actors.length)])
	}, 50)
	engine.start(60) // Start update loop
}
