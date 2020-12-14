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
