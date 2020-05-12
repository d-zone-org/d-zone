import { Entity, System, Component } from 'ecs-lib'
import { Sprite, SpriteComponent } from '../components/SpriteComponent'
type PushSpritesToRendererFn = (
	sprites: Record<string, Component<Sprite>[]>
) => void

export default class SpriteSystem extends System {
	private sprites: Record<string, Component<Sprite>[]> = {
		added: [],
		changed: [],
		removed: [],
	}

	constructor(private readonly pushSpritesToRenderer: PushSpritesToRendererFn) {
		super([SpriteComponent.type])
	}

	update(_time: number, _delta: number, entity: Entity): void {
		let sprite: Component<Sprite> = SpriteComponent.oneFrom(entity)
		if (sprite.data.dirty) {
			this.sprites.changed.push(sprite)
			sprite.data.dirty = false
		}
	}

	afterUpdateAll(_time: number, _entities: Entity[]) {
		this.pushSpritesToRenderer(this.sprites)
		this.sprites.added.length = 0
		this.sprites.changed.length = 0
		this.sprites.removed.length = 0
	}

	enter(entity: Entity): void {
		let sprite: Component<Sprite> = SpriteComponent.oneFrom(entity)
		this.sprites.added.push(sprite)
	}

	exit(entity: Entity): void {
		let sprite: Component<Sprite> = SpriteComponent.oneFrom(entity)
		this.sprites.removed.push(sprite)
	}
}
