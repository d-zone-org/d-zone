import Texture from './components/texture'
import Graphic from './components/graphic'
import Animation from './components/animation'
import Transform from './components/transform'
import Draw from './components/draw'
import PixiObject from './components/pixi-object'
import Actor from './components/actor'
import Hop from './components/hop'
import Map from './components/map'
import HopSystem from './systems/hop'
import AnimationSystem from './systems/animation'
import TransformSystem from './systems/transform'
import PixiSystem from './systems/pixi'
import type Renderer from '../renderer'
import type Resources from '../renderer/resources/resources'
import Engine, { SystemGroup, Tags } from '.'

/**
 * Registers all components, tags, and systems to the ECS world instance.
 *
 * @param engine - The game engine instance.
 * @param renderer - The game renderer instance.
 * @param resources - The game resources instance.
 */
export function registerECS(
	engine: Engine,
	renderer: Renderer,
	resources: Resources
) {
	engine.world.registerComponent(Texture)
	engine.world.registerComponent(Graphic)
	engine.world.registerComponent(Animation)
	engine.world.registerComponent(Transform)
	engine.world.registerComponent(Draw)
	engine.world.registerComponent(Actor)
	engine.world.registerComponent(Hop)
	engine.world.registerComponent(Map)
	engine.world.registerComponent(PixiObject)

	engine.world.registerTags(Tags.Solid, Tags.Platform)

	// Systems are registered in order of execution during the update loop.
	// For now, all systems run under the "default" group.
	engine.world.registerSystem(SystemGroup.Default, HopSystem, [
		resources.sheet.spritesheet.animations,
	])
	engine.world.registerSystem(SystemGroup.Default, AnimationSystem)
	engine.world.registerSystem(SystemGroup.Default, TransformSystem)
	engine.world.registerSystem(SystemGroup.Default, PixiSystem, [
		resources.sheet.textures,
		renderer,
	])
}
