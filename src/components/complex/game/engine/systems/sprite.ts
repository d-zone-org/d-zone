import { Query, System } from 'ape-ecs'
import Sprite from '../components/sprite'
import PixiSprite from '../components/pixi-sprite'
import * as PIXI from 'pixi.js-legacy'

export default class SpriteSystem extends System {
	private resources: any
	private renderer: any
	private textures: any
	private view: any
	private cull: any
	private spriteQuery!: Query
	private spriteAddQuery!: Query
	private spriteRemoveQuery!: Query

	init(resources: any, renderer: any) {
		this.resources = resources
		this.textures = this.resources.sheet.textures
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
		let updatedSprites = 0
		this.spriteQuery.execute().forEach((entity) => {
			if (entity.c.sprite._meta.updated !== tick) return
			let sprite = entity.c.sprite
			let { sprite: pixiSprite } = entity.c.pixiSprite
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

		this.spriteAddQuery.execute().forEach((entity) => {
			let sprite = entity.c.sprite
			let pixiSprite = new PIXI.Sprite(
				this.resources.sheet.textures[sprite.texture]
			)
			pixiSprite.setTransform(sprite.x, sprite.y)
			pixiSprite.zIndex = sprite.zIndex
			this.view.addChild(pixiSprite)
			entity.addComponent({
				type: PixiSprite.typeName,
				key: 'pixiSprite',
				sprite: pixiSprite,
			})
		})

		this.spriteRemoveQuery.execute().forEach((entity) => {
			let pixiSprite = entity.c.pixiSprite
			this.view.removeChild(pixiSprite.value)
			pixiSprite.value.destroy()
			entity.removeComponent(pixiSprite)
		})
	}
}
