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
import { Map3D } from '../common/map'
import Engine from '.'

export function registerECS(
	engine: Engine,
	renderer: Renderer,
	resources: Resources,
	map: Map3D
) {
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
}
