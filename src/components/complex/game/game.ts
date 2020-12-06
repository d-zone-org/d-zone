import Renderer from './renderer/renderer'
import Resources from './renderer/resources/resources'
import Engine from './engine/engine'
import { Map3D } from './common/map'
import { addActors, hopActor } from './engine/benchmark'
import Sprite from './engine/components/sprite'
import PixiSprite from './engine/components/pixi-sprite'
import Transform from './engine/components/transform'
import Actor from './engine/components/actor'
import Hop from './engine/components/hop'
import MapCell from './engine/components/map-cell'
import HopSystem from './engine/systems/hop'
import MapSystem from './engine/systems/map'
import TransformSystem from './engine/systems/transform'
import SpriteSystem from './engine/systems/sprite'

export async function initGame(canvas: HTMLCanvasElement) {
	const renderer: Renderer = new Renderer(canvas)
	console.log('Renderer created', renderer.app.stage)
	const resources = new Resources()
	await resources.load()
	console.log('Resources loaded')
	const engine: Engine = new Engine()
	const map: Map3D = new Map3D()
	engine.world.registerComponent(Sprite)
	engine.world.registerComponent(Transform)
	engine.world.registerComponent(Actor)
	engine.world.registerComponent(Hop)
	engine.world.registerComponent(MapCell)
	engine.world.registerComponent(PixiSprite)
	engine.world.registerSystem('default', HopSystem, [
		resources.sheet.spritesheet.animations,
	])
	engine.world.registerSystem('default', MapSystem, [map])
	engine.world.registerSystem('default', TransformSystem)
	engine.world.registerSystem('default', SpriteSystem, [
		resources.sheet.textures,
		renderer,
	])
	console.log('ECS world initialized!', engine.world)
	const actors = addActors(engine.world, 100)
	setInterval(() => {
		hopActor(actors[Math.floor(Math.random() * actors.length)])
	}, 250)
	engine.start(60) // Start update loop
}
