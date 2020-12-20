import Sprite from './components/sprite'
import PixiSprite from './components/pixi-sprite'
import Transform from './components/transform'
import Actor from './components/actor'
import Hop from './components/hop'
import MapCell from './components/map-cell'
import HopSystem from './systems/hop'
import MapSystem from './systems/map'
import TransformSystem from './systems/transform'
import SpriteSystem from './systems/sprite'
import Renderer from '../renderer'
import Resources from '../renderer/resources/resources'
import Engine, { SystemGroup } from '.'

/**
 * Registers all components and systems to the ECS world instance.
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
	engine.world.registerComponent(Sprite)
	engine.world.registerComponent(Transform)
	engine.world.registerComponent(Actor)
	engine.world.registerComponent(Hop)
	engine.world.registerComponent(MapCell)
	engine.world.registerComponent(PixiSprite)

	// Systems are registered in order of execution during the update loop.
	// For now, all systems run under the "default" group.
	engine.world.registerSystem(SystemGroup.Default, HopSystem, [
		resources.sheet.spritesheet.animations,
	])
	engine.world.registerSystem(SystemGroup.Default, MapSystem)
	engine.world.registerSystem(SystemGroup.Default, TransformSystem)
	engine.world.registerSystem(SystemGroup.Default, SpriteSystem, [
		resources.sheet.textures,
		renderer,
	])
}
