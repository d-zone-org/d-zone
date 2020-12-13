import { Query, System } from 'ape-ecs'
import Sprite from '../components/sprite'
import PixiSprite from '../components/pixi-sprite'
import * as PIXI from 'pixi.js-legacy'
import type Renderer from '../../renderer'
import type { Plugins } from '../../renderer'
import type { Viewport } from 'pixi-viewport'
import type SpatialHash from 'pixi-cull/dist/spatial-hash'
import type { Textures } from '../../typings'

export default class SpriteSystem extends System {
	private renderer!: Renderer
	private textures!: Textures
	private view!: Viewport<Plugins>
	private cull!: SpatialHash
	private spriteQuery!: Query
	private spriteAddQuery!: Query
	private spriteRemoveQuery!: Query

	init(textures: Textures, renderer: Renderer) {
		this.textures = textures
		this.renderer = renderer
		this.view = this.renderer.view
		this.cull = this.renderer.cull
		this.spriteQuery = this.createQuery().fromAll(Sprite, PixiSprite).persist()
		this.spriteAddQuery = this.createQuery()
			.fromAll(Sprite)
			.not(PixiSprite)
			.persist()
		this.spriteRemoveQuery = this.createQuery()
			.fromAll(PixiSprite)
			.not(Sprite)
			.persist()
	}

	update(tick: number) {
		this.updatePixiSprites(tick)
		this.addPixiSprites()
		this.removePixiSprites()
	}

	updatePixiSprites(tick: number) {
		let updatedSprites = 0
		this.spriteQuery.execute().forEach((entity) => {
			if (entity.c.sprite._meta.updated !== tick) return
			const sprite = entity.c.sprite
			const { sprite: pixiSprite } = entity.c.pixiSprite
			pixiSprite.setTransform(sprite.x, sprite.y)
			pixiSprite.zIndex = sprite.zIndex
			pixiSprite.texture = this.textures[sprite.texture]
			pixiSprite.anchor = pixiSprite.texture.defaultAnchor
			this.cull.updateObject(pixiSprite)
			updatedSprites++
		})
		if (updatedSprites > 0) {
			this.cull.cull(this.view.getVisibleBounds())
		}
	}

	addPixiSprites() {
		this.spriteAddQuery.execute().forEach((entity) => {
			const sprite = entity.c.sprite
			const pixiSprite = new PIXI.Sprite(this.textures[sprite.texture])
			pixiSprite.setTransform(sprite.x, sprite.y)
			pixiSprite.zIndex = sprite.zIndex
			this.view.addChild(pixiSprite)
			entity.addComponent({
				type: PixiSprite.typeName,
				key: 'pixiSprite',
				sprite: pixiSprite,
			})
		})
	}

	removePixiSprites() {
		this.spriteRemoveQuery.execute().forEach((entity) => {
			const pixiSprite = entity.c.pixiSprite
			this.view.removeChild(pixiSprite.value)
			pixiSprite.value.destroy()
			entity.removeComponent(pixiSprite)
		})
	}
}
